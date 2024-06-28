import { usePathname, useRouter } from "next/navigation";
import styles from "./Hamburger.module.css";
import React, { useState } from "react";
import Link from "next/link";
import { toCalendarPage, toGenrePage, toPostPage } from "../../../modules/paths";
import { isAdminPage, getYearMonth } from "../../../modules/utils";
import { GENRES } from "../../../modules/constants";
import { fetchRandomAlbumId } from "@/app/modules/api";

export const Hamburger = () => {
  const pathName = usePathname();
  const router = useRouter();
  const [showCategory, setShowCategory] = useState<boolean>(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>();

  async function handleRandomButton() {
    const randomId = await fetchRandomAlbumId();
    router.push(`${toPostPage(pathName, randomId)}`);
  }

  function handleCalendarButton() {
    router.push(toCalendarPage(pathName));
  }

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
          <div className={styles.categoryTitle}>장르</div>
          {Object.keys(GENRES).map((category: string) => (
            <Link key={category} href={toGenrePage(pathName, category)}>
              <li
                className={`${styles.categoryItem} ${
                  hoveredItem === category ? styles.hovered : ""
                }`}
                onMouseEnter={() => setHoveredItem(category)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {GENRES[category]}
              </li>
            </Link>
          ))}
        </ul>
      ) : null}
      {showCategory && isAdminPage(pathName) && (
        <ul className={styles.adminCategory}>
          <li className={styles.categoryTitle}>관리자 메뉴</li>
          <li
            className={`${styles.categoryItem} ${hoveredItem === "title" ? styles.hovered : ""}`}
            onMouseEnter={() => setHoveredItem("title")}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => {
              router.push("/admin/upload");
            }}
          >
            글쓰기
          </li>
          <li
            className={`${styles.categoryItem} ${hoveredItem === "shuffle" ? styles.hovered : ""}`}
            onMouseEnter={() => setHoveredItem("shuffle")}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={handleRandomButton}
          >
            랜덤
          </li>
          <li
            className={`${styles.categoryItem} ${hoveredItem === "calendar" ? styles.hovered : ""}`}
            onMouseEnter={() => setHoveredItem("calendar")}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={handleCalendarButton}
          >
            달력
          </li>
        </ul>
      )}
    </nav>
  );
};
