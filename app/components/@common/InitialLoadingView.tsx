import styles from "./InitialLoadingView.module.css";

interface LoadingProps {
  totalScrollCount: number;
}

export const InitialLoadingView = ({ totalScrollCount }: LoadingProps) => {
  const loadingText = "데이터 로딩 중입니다...";

  return (
    <div style={{ display: totalScrollCount ? "none" : "flex" }}>
      <div className={styles["loading-background"]}></div>
      <div className={styles["loading-text"]}>{loadingText}</div>
    </div>
  );
};
