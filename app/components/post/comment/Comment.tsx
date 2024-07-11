import styles from "./Comment.module.css";

export const Comment = () => {
  return (
    <div className={styles.container}>
      <div className={styles.userImageWrapper}>
        <div className={styles.userImage}></div>
      </div>
    </div>
  );
};
