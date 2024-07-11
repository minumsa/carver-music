import styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerWrapper}>
        <div>Contact Information</div>
        <div>Mobile +82 (0)10 7100 1626</div>
        <a href="https://github.com/minumsa/carver-music" target="_blank">
          <div className={styles.githubIcon}></div>
        </a>
      </div>
    </footer>
  );
};
