import { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { commentsAtom, repliesAtom, userIdAtom } from "@/app/modules/atoms";
import { LoginAlert } from "../@common/LoginAlert";
import { LikeIcon } from "./LikeIcon";
import { likeCommentToggle, likeReplyToggle } from "@/app/modules/api/comment";
import { verifyLoginStatus } from "@/app/modules/api/auth";

interface LikeButtonProps {
  albumId: string;
  entityIdKey: "comment" | "reply";
  entityIdValue: string;
  likedUserIds: string[];
}

export const LikeButton = ({
  albumId,
  entityIdKey,
  entityIdValue,
  likedUserIds,
}: LikeButtonProps) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(likedUserIds.length);
  const [activeLikeUserIds, setCurrentLikeUserIds] = useState<string[]>(likedUserIds);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const activeUserId = useAtomValue(userIdAtom);
  const setComments = useSetAtom(commentsAtom);
  const setReplies = useSetAtom(repliesAtom);

  async function handleLikeToggle() {
    const { isLoggedIn } = await verifyLoginStatus();
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    const updatedLikeUserIds = isLiked
      ? activeLikeUserIds.filter((userId) => userId !== activeUserId)
      : [...activeLikeUserIds, activeUserId];

    setIsLiked(!isLiked);
    setCurrentLikeUserIds(updatedLikeUserIds);

    const likeToggleParams = {
      albumId,
      entityIdKey: entityIdValue,
      userId: activeUserId,
      likedUserIds: updatedLikeUserIds,
    };

    if (entityIdKey === "comment") {
      const response = await likeCommentToggle(likeToggleParams);
      setComments(response.comments);
    } else if (entityIdKey === "reply") {
      const response = await likeReplyToggle(likeToggleParams);
      setReplies(response.replies);
    }
  }

  useEffect(() => {
    const wasLikedBefore = likedUserIds.includes(activeUserId);
    setIsLiked(wasLikedBefore);
  }, [likedUserIds, activeUserId]);

  useEffect(() => {
    setLikeCount(activeLikeUserIds.length);
  }, [activeLikeUserIds]);

  return (
    <>
      <LoginAlert showModal={showLoginModal} setShowModal={setShowLoginModal} />
      <LikeIcon isLiked={isLiked} likeCount={likeCount} fetchLike={handleLikeToggle} />
    </>
  );
};
