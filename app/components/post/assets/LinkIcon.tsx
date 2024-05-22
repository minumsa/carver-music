import styles from "./LinkIcon.module.css";

export const LinkIcon = () => {
  return (
    <span>
      <img className={styles.linkIcon} src="/icons/link.svg" alt="link-icon" />
    </span>
  );
};
