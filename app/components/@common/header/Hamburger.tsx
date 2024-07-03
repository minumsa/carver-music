import styles from "./Hamburger.module.css";
import React, { useState } from "react";
import { DesktopMenu } from "./DesktopMenu";
import { MobileMenu } from "./MobileMenu";

export const Hamburger = () => {
  const [showCategory, setShowCategory] = useState<boolean>(false);

  return (
    <nav
      className={styles.container}
      onClick={() => {
        setShowCategory(!showCategory);
      }}
    >
      <button
        className={styles.hamburgerIcon}
        style={{ display: showCategory ? "none" : "flex" }}
        aria-label="Open category"
      ></button>
      <button
        className={styles.closeIcon}
        style={{ display: showCategory ? "flex" : "none" }}
        aria-label="Close category"
      >
        <div className={styles.closeText}>×</div>
      </button>
      <DesktopMenu showCategory={showCategory} />
      <MobileMenu showCategory={showCategory} />
    </nav>
  );
};
