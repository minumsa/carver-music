import { fetchRandomAlbumId } from "@/app/modules/api";
import { GENRES } from "@/app/modules/constants";
import { toCalendarPage, toGenrePage, toPostPage } from "@/app/modules/paths";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./DesktopMenu.module.css";
import { isAdminPage } from "@/app/modules/utils";
import Link from "next/link";

interface DesktopMenuProps {
  showCategory: boolean;
}

export const DesktopMenu = ({ showCategory }: DesktopMenuProps) => {
  const pathName = usePathname();
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState<string | null>();

  async function handleRandomButton() {
    const randomId = await fetchRandomAlbumId();
    router.push(`${toPostPage(pathName, randomId)}`);
  }

  function handleCalendarButton() {
    router.push(toCalendarPage(pathName));
  }

  return (
    <div className={styles.container}>
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
    </div>
  );
};
