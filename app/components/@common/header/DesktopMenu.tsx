import { getRandomAlbumId } from "@/app/modules/api/album";
import { toCalendarPage, toGenrePage, toPostPage } from "@/app/modules/paths";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./DesktopMenu.module.css";
import Link from "next/link";
import { useAtom, useSetAtom } from "jotai";
import { userIdAtom, userImageAtom, userNameAtom } from "@/app/modules/atoms";
import { userLogout } from "@/app/modules/api/auth";
import { GENRES } from "@/app/modules/constants/genres";

interface DesktopMenuProps {
  showCategory: boolean;
}

export const DesktopMenu = ({ showCategory }: DesktopMenuProps) => {
  const pathName = usePathname();
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState<string | null>();
  const setUserName = useSetAtom(userNameAtom);
  const [userImage, setUserImage] = useAtom(userImageAtom);
  const [userId, setUserId] = useAtom(userIdAtom);

  async function handleRandomButton() {
    const randomId = await getRandomAlbumId();
    router.push(`${toPostPage(pathName, randomId)}`);
  }

  function handleCalendarButton() {
    router.push(toCalendarPage(pathName));
  }

  async function handleLogout() {
    await userLogout();
    setUserId("");
    setUserName("방문자");
    setUserImage("/svgs/ghost.svg");
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
      {showCategory && (
        <ul className={styles.adminCategory}>
          <li className={styles.categoryTitle}>메뉴</li>
          <li
            className={`${styles.categoryItem} ${hoveredItem === "login" ? styles.hovered : ""}`}
            onMouseEnter={() => setHoveredItem("login")}
            onMouseLeave={() => setHoveredItem(null)}
            // window.open("/login", "_blank", "width=800,height=600");
            onClick={() => {
              userId ? handleLogout() : router.push("/login");
            }}
          >
            {userId ? (
              <div className={styles.profileItem}>
                <div>로그아웃</div>
                <div className={styles.userImageWrapper}>
                  <img src={userImage} className={styles.userImage} alt="user-image" />
                </div>
              </div>
            ) : (
              "로그인"
            )}
          </li>
          {userId === "carver" && (
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
          )}
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
