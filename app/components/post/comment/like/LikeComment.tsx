import { checkUserLoginStatus, likeCommentToggle } from "@/app/modules/api";
import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { userIdAtom } from "@/app/modules/atoms";
import { Comment } from "@/app/modules/types";
import { LoginAlert } from "../@common/LoginAlert";
import { LikeIcon } from "./LikeIcon";

interface LikeCommentProps {
  comment: Comment;
  fetchComments: any;
}

export const LikeComment = ({ comment, fetchComments }: LikeCommentProps) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(comment.likedUserIds.length);
  const activeUserId = useAtomValue(userIdAtom);
  const [currentLikeUserIds, setCurrentLikeUserIds] = useState<string[]>(comment.likedUserIds);
  const [showLoginModal, setShowLoginModal] = useState(false);

  async function fetchLike() {
    const response = await checkUserLoginStatus();
    if (!response.ok) {
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
      commentId: comment._id,
      userId: activeUserId,
      likedUserIds: tmpLikeUserIds,
    };
    await likeCommentToggle(likeToggleParams);
    await fetchComments();
  }

  useEffect(() => {
    const likedBefore = comment.likedUserIds.includes(activeUserId);
    if (likedBefore) setIsLiked(true);
  }, [comment.likedUserIds, activeUserId]);

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
