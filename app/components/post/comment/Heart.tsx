import styles from "./Heart.module.css";
import { useEffect, useState } from "react";

export const Heart = () => {
  const [heartClicked, setHeartClicked] = useState<boolean>(false);
  const heartStyle = heartClicked ? { fill: "#D21312", stroke: "#D21312" } : undefined;
  const heartTextStyle = heartClicked ? { color: "#D21312" } : undefined;
  const handleHeartClick = () => setHeartClicked(!heartClicked);
  const [totalClickedHeart, setTotalClickedHeart] = useState<number>(0);
  const totalClickedHeartFromDB = 0;

  useEffect(() => {
    if (heartClicked) {
      setTotalClickedHeart(totalClickedHeartFromDB + 1);
    } else {
      setTotalClickedHeart(totalClickedHeartFromDB);
    }
  }, [heartClicked]);

  return (
    <div className={styles.container}>
      <svg
        width="18px"
        height="18px"
        viewBox="0 0 192 192"
        xmlns="http://www.w3.org/2000/svg"
        style={heartStyle}
        className={styles.heartSvgFile}
        onClick={handleHeartClick}
      >
        <path d="M60.732 29.7C41.107 29.7 22 39.7 22 67.41c0 27.29 45.274 67.29 74 94.89 28.744-27.6 74-67.6 74-94.89 0-27.71-19.092-37.71-38.695-37.71C116 29.7 104.325 41.575 96 54.066 87.638 41.516 76 29.7 60.732 29.7z" />
      </svg>
      <div style={heartTextStyle}>{totalClickedHeart}</div>
    </div>
  );
};
