import { toggleLike } from "@/app/modules/api";
import styles from "./Heart.module.css";
import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { userIdAtom } from "@/app/modules/atoms";
import { Comment } from "@/app/modules/types";

interface HeartProps {
  comment: Comment;
  fetchComments: any;
}

export const Heart = ({ comment, fetchComments }: HeartProps) => {
  const [heartClickedBefore, setHeartClickedBefore] = useState<boolean>(false);
  const darkRedColor = "#D21312";
  const heartStyle = heartClickedBefore ? { fill: darkRedColor, stroke: darkRedColor } : undefined;
  const heartTextStyle = heartClickedBefore ? { color: darkRedColor } : undefined;
  const [totalClickedHeart, setTotalClickedHeart] = useState<number>(comment.likedUserIds.length);
  const userId = useAtomValue(userIdAtom);
  const [currentLikeUserIds, setCurrentLikeUserIds] = useState<string[]>(comment.likedUserIds);

  async function fetchLike() {
    let tmpCurrentLikeUserIds;
    if (heartClickedBefore) {
      tmpCurrentLikeUserIds = currentLikeUserIds.filter((prevUserId) => prevUserId !== userId);
    } else {
      tmpCurrentLikeUserIds = [...currentLikeUserIds, userId];
    }

    setHeartClickedBefore(!heartClickedBefore);
    setCurrentLikeUserIds(tmpCurrentLikeUserIds);

    const toggleLikeParams = {
      commentId: comment._id,
      userId,
      likedUserIds: tmpCurrentLikeUserIds,
    };
    await toggleLike(toggleLikeParams);
    await fetchComments();
  }

  useEffect(() => {
    const likedBefore = comment.likedUserIds.includes(userId);
    if (likedBefore) {
      setHeartClickedBefore(true);
    }
  }, [comment.likedUserIds, userId]);

  useEffect(() => {
    setTotalClickedHeart(currentLikeUserIds.length);
  }, [currentLikeUserIds]);

  return (
    <div className={styles.container}>
      <svg
        width="18px"
        height="18px"
        viewBox="0 0 192 192"
        xmlns="http://www.w3.org/2000/svg"
        style={heartStyle}
        className={styles.heartSvgFile}
        onClick={fetchLike}
      >
        <path d="M60.732 29.7C41.107 29.7 22 39.7 22 67.41c0 27.29 45.274 67.29 74 94.89 28.744-27.6 74-67.6 74-94.89 0-27.71-19.092-37.71-38.695-37.71C116 29.7 104.325 41.575 96 54.066 87.638 41.516 76 29.7 60.732 29.7z" />
      </svg>
      <div style={heartTextStyle}>{totalClickedHeart}</div>
    </div>
  );
};
