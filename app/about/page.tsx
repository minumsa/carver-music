"use client";

import styles from "../divdivdiv/divdivdiv.module.css";
import { Nav } from "../divdivdiv/components/Nav";
import About from "../divdivdiv/components/About";

export default function Page() {
  return (
    <div className={styles["container-background"]}>
      <div className={styles["container"]}>
        <div className={styles["nav-container"]}>
          <Nav />
        </div>
        <div className={styles["content"]}>
          <About />
        </div>
      </div>
    </div>
  );
}
