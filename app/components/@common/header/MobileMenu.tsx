import styles from "./MobileMenu.module.css";

interface MobileMenuProps {
  showCategory: boolean;
}

export const MobileMenu = ({ showCategory }: MobileMenuProps) => {
  return (
    <>
      {showCategory && (
        <div className={styles.container}>
          <div className={styles.wrapper}>테스트</div>
        </div>
      )}
    </>
  );
};
