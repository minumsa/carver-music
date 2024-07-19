import { DARK_RED_COLOR } from "@/app/modules/constants";
import styles from "./LikeIcon.module.css";

interface LikeIconProps {
  isLiked: boolean;
  likeCount: number;
  fetchLike: () => Promise<void>;
}

export const LikeIcon = ({ isLiked, likeCount, fetchLike }: LikeIconProps) => {
  const clickedLikeStyle = isLiked ? { fill: DARK_RED_COLOR, stroke: DARK_RED_COLOR } : undefined;
  const clickedLikeTextStyle = isLiked ? { color: DARK_RED_COLOR } : undefined;

  return (
    <div className={styles.container}>
      <svg
        width="18px"
        height="18px"
        viewBox="0 0 192 192"
        xmlns="http://www.w3.org/2000/svg"
        style={clickedLikeStyle}
        className={styles.likeIcon}
        onClick={fetchLike}
      >
        <path d="M60.732 29.7C41.107 29.7 22 39.7 22 67.41c0 27.29 45.274 67.29 74 94.89 28.744-27.6 74-67.6 74-94.89 0-27.71-19.092-37.71-38.695-37.71C116 29.7 104.325 41.575 96 54.066 87.638 41.516 76 29.7 60.732 29.7z" />
      </svg>
      <div style={clickedLikeTextStyle}>{likeCount}</div>
    </div>
  );
};
