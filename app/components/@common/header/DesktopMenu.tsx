import { checkUserLoginStatus, fetchRandomAlbumId, userLogout } from "@/app/modules/api";
import { GENRES } from "@/app/modules/constants";
import { toCalendarPage, toGenrePage, toPostPage } from "@/app/modules/paths";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./DesktopMenu.module.css";
import { isAdminPage } from "@/app/modules/utils";
import Link from "next/link";
import { useAtom, useSetAtom } from "jotai";
import { userImageAtom, userNameAtom } from "@/app/modules/atoms";

interface DesktopMenuProps {
  showCategory: boolean;
}

export const DesktopMenu = ({ showCategory }: DesktopMenuProps) => {
  const pathName = usePathname();
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState<string | null>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const setCurrentUserName = useSetAtom(userNameAtom);
  const [currentUserImage, setCurrentUserImage] = useAtom(userImageAtom);

  async function handleRandomButton() {
    const randomId = await fetchRandomAlbumId();
    router.push(`${toPostPage(pathName, randomId)}`);
  }

  function handleCalendarButton() {
    router.push(toCalendarPage(pathName));
  }

  useEffect(() => {
    async function loginCheck() {
      try {
        const response = await checkUserLoginStatus();
        if (response.ok) setIsLoggedIn(true);
      } catch (error) {
        console.error(error);
      }
    }

    loginCheck();
  }, [showCategory]);

  async function handleLogout() {
    await userLogout();
    setCurrentUserName("");
    setCurrentUserImage("");
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
            onClick={() => {
              isLoggedIn ? handleLogout() : router.push("/login");
            }}
          >
            {isLoggedIn ? (
              <div className={styles.profileItem}>
                <div>로그아웃</div>
                <div className={styles.userImageWrapper}>
                  <img src={currentUserImage} className={styles.userImage} alt="user-image" />
                </div>
              </div>
            ) : (
              "로그인"
            )}
          </li>
          {isAdminPage(pathName) && (
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
