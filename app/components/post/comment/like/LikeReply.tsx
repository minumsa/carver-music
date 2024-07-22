import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { userIdAtom } from "@/app/modules/atoms";
import { Reply } from "@/app/modules/types";
import { LoginAlert } from "../@common/LoginAlert";
import { LikeIcon } from "./LikeIcon";
import { likeReplyToggle } from "@/app/modules/api/comment";
import { checkUserLoginStatus } from "@/app/modules/api/auth";

interface LikeReplyProps {
  reply: Reply;
  fetchComments: any;
}

export const LikeReply = ({ reply, fetchComments }: LikeReplyProps) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(reply.likedUserIds.length);
  const activeUserId = useAtomValue(userIdAtom);
  const [currentLikeUserIds, setCurrentLikeUserIds] = useState<string[]>(reply.likedUserIds);
  const [showLoginModal, setShowLoginModal] = useState(false);

  async function fetchLike() {
    const loginResponse = await checkUserLoginStatus();
    if (!loginResponse.ok) {
      setShowLoginModal(true);
      return;
    }

    let tmpLikeUserIds;
    if (isLiked) {
      tmpLikeUserIds = currentLikeUserIds.filter((userId) => userId !== activeUserId);
    } else {
      tmpLikeUserIds = [...currentLikeUserIds, activeUserId];
    }

    setIsLiked(!isLiked);
    setCurrentLikeUserIds(tmpLikeUserIds);

    const likeToggleParams = {
      replyId: reply._id,
      userId: activeUserId,
      likedUserIds: tmpLikeUserIds,
    };
    await likeReplyToggle(likeToggleParams);
    await fetchComments();
  }

  useEffect(() => {
    const likedBefore = reply.likedUserIds.includes(activeUserId);
    if (likedBefore) setIsLiked(true);
  }, [reply.likedUserIds, activeUserId]);

  useEffect(() => {
    setLikeCount(currentLikeUserIds.length);
  }, [currentLikeUserIds]);

  return (
    <>
      <LoginAlert showModal={showLoginModal} setShowModal={setShowLoginModal} />
      <LikeIcon isLiked={isLiked} likeCount={likeCount} fetchLike={fetchLike} />
    </>
  );
};
