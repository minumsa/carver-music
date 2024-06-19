import { usePathname, useRouter } from "next/navigation";
import styles from "./Hamburger.module.css";
import React, { useState } from "react";
import Link from "next/link";
import { useSetAtom } from "jotai";
import { tagAtom } from "../../../modules/atoms";
import { toGenrePage } from "../../../modules/paths";
import { isAdminPage } from "../../../modules/utils";
import { GENRES } from "../../../modules/constants";

export const Hamburger = () => {
  const pathName = usePathname();
  const router = useRouter();
  const [showCategory, setShowCategory] = useState<boolean>(false);
  const setCurrentTagKey = useSetAtom(tagAtom);

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
      {showCategory ? (
        <ul className={styles.category}>
          {Object.keys(GENRES).map((category) => {
            return (
              <React.Fragment key={category}>
                <Link
                  href={toGenrePage(pathName, category)}
                  onClick={() => {
                    setCurrentTagKey("");
                    console.log("category", category);
                  }}
                >
                  <li className={styles.categoryItem}>{GENRES[category]}</li>
                </Link>
              </React.Fragment>
            );
          })}
        </ul>
      ) : null}
      {showCategory && isAdminPage(pathName) && (
        <div className={styles.adminCategory}>
          <div className={styles.categoryItemTitle}>관리자 메뉴</div>
          <div
            className={styles.categoryItem}
            onClick={() => {
              router.push("/admin/upload");
            }}
          >
            글쓰기
          </div>
        </div>
      )}
    </nav>
  );
};
