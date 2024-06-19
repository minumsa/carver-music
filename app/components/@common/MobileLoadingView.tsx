import { memo } from "react";
import styles from "./MobileLoadingView.module.css";

interface LoadingProps {
  isLoading: boolean;
}

const MobileLoadingView = ({ isLoading }: LoadingProps) => {
  const loadingText = "데이터 로딩 중입니다...";

  return (
    <div style={{ display: isLoading ? "flex" : "none" }}>
      <div className={styles.loadingBackground}></div>
      <div className={styles.loadingText}>{loadingText}</div>
    </div>
  );
};

export default memo(MobileLoadingView);
