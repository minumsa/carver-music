import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { userIdAtom } from "@/app/modules/atoms";
import { LoginAlert } from "../@common/LoginAlert";
import { LikeIcon } from "./LikeIcon";
import { likeCommentToggle, likeReplyToggle } from "@/app/modules/api/comment";
import { verifyLoginStatus } from "@/app/modules/api/auth";

interface LikeButtonProps {
  entityIdKey: string;
  entityIdValue: string;
  likedUserIds: string[];
  fetchComments: () => Promise<void>;
}

export const LikeButton = ({
  entityIdKey,
  entityIdValue,
  likedUserIds,
  fetchComments,
}: LikeButtonProps) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(likedUserIds.length);
  const activeUserId = useAtomValue(userIdAtom);
  const [currentLikeUserIds, setCurrentLikeUserIds] = useState<string[]>(likedUserIds);
  const [showLoginModal, setShowLoginModal] = useState(false);

  async function handleLikeToggle() {
    const loginResponse = await verifyLoginStatus();
    if (!loginResponse.ok) {
      setShowLoginModal(true);
      return;
    }

    const updatedLikeUserIds = isLiked
      ? currentLikeUserIds.filter((userId) => userId !== activeUserId)
      : [...currentLikeUserIds, activeUserId];

    setIsLiked(!isLiked);
    setCurrentLikeUserIds(updatedLikeUserIds);

    const likeToggleParams = {
      entityIdKey: entityIdValue,
      userId: activeUserId,
      likedUserIds: updatedLikeUserIds,
    };

    if (entityIdKey === "comment") {
      await likeCommentToggle(likeToggleParams);
    } else if (entityIdKey === "reply") {
      await likeReplyToggle(likeToggleParams);
    }

    await fetchComments();
  }

  useEffect(() => {
    const wasLikedBefore = likedUserIds.includes(activeUserId);
    setIsLiked(wasLikedBefore);
  }, [likedUserIds, activeUserId]);

  useEffect(() => {
    setLikeCount(currentLikeUserIds.length);
  }, [currentLikeUserIds]);

  return (
    <>
      <LoginAlert showModal={showLoginModal} setShowModal={setShowLoginModal} />
      <LikeIcon isLiked={isLiked} likeCount={likeCount} fetchLike={handleLikeToggle} />
    </>
  );
};
