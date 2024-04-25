import { usePathname, useRouter } from "next/navigation";
import styles from "./Hamburger.module.css";
import React, { useState } from "react";
import Link from "next/link";
import { useAtom } from "jotai";
import { tagKeyAtom } from "../../../modules/atoms";
import { toGenrePage } from "../../../modules/paths";
import { isAdminPage } from "../../../modules/utils";
import { GENRES } from "../../../modules/constants";

export const Hamburger = () => {
  const pathName = usePathname();
  const router = useRouter();
  const [showCategory, setShowCategory] = useState<boolean>(false);
  const [currentTagKey, setCurrentTagKey] = useAtom(tagKeyAtom);

  return (
    <nav
      className={styles["container"]}
      onClick={() => {
        setShowCategory(!showCategory);
      }}
    >
      <button
        className={styles["hamburger-icon"]}
        style={{ display: showCategory ? "none" : "flex" }}
        aria-label="Open category"
      ></button>
      <button
        className={styles["close-icon"]}
        style={{ display: showCategory ? "flex" : "none" }}
        aria-label="Close category"
      >
        <div className={styles["close-text"]}>×</div>
      </button>
      {showCategory ? (
        <ul className={styles["category"]}>
          {Object.keys(GENRES).map(category => {
            return (
              <React.Fragment key={category}>
                <Link
                  href={toGenrePage(pathName, category)}
                  onClick={() => {
                    setCurrentTagKey("");
                  }}
                >
                  <li className={styles["category-item"]}>{GENRES[category]}</li>
                </Link>
              </React.Fragment>
            );
          })}
        </ul>
      ) : null}
      {showCategory && isAdminPage(pathName) && (
        <div className={styles["admin-category"]}>
          <div className={styles["category-item-title"]}>관리자 메뉴</div>
          <div
            className={styles["category-item"]}
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
