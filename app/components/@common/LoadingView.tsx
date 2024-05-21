import styles from "./LoadingView.module.css";

interface LoadingProps {
  isLoading: boolean;
}

export const LoadingView = ({ isLoading }: LoadingProps) => {
  const loadingText = "데이터 로딩 중입니다...";

  return (
    <div style={{ display: isLoading ? "flex" : "none" }}>
      <div className={styles["loading-background"]}></div>
      <div className={styles["loading-text"]}>{loadingText}</div>
    </div>
  );
};