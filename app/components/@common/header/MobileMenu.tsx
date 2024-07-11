import { GENRES } from "@/app/modules/constants";
import styles from "./MobileMenu.module.css";
import Link from "next/link";
import { toCalendarPage, toGenrePage, toPostPage } from "@/app/modules/paths";
import { usePathname, useRouter } from "next/navigation";
import { checkUserLoginStatus, fetchRandomAlbumId, userLogout } from "@/app/modules/api";
import { isAdminPage } from "@/app/modules/utils";
import { useEffect, useState } from "react";
import { userImageAtom, userNameAtom } from "@/app/modules/atoms";
import { useAtom, useSetAtom } from "jotai";

interface MobileMenuProps {
  showCategory: boolean;
}

export const MobileMenu = ({ showCategory }: MobileMenuProps) => {
  const pathName = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const setCurrentUserName = useSetAtom(userNameAtom);
  const [currentUserImage, setCurrentUserImage] = useAtom(userImageAtom);

  async function handleRandomButton() {
    const randomId = await fetchRandomAlbumId();
    router.push(toPostPage(pathName, randomId));
  }

  function handleCalendarButton() {
    router.push(toCalendarPage(pathName));
  }

  useEffect(() => {
    function handleTouchMove(event: any) {
      if (showCategory) {
        event.preventDefault();
      }
    }
    window.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    return () => window.removeEventListener("touchmove", handleTouchMove);
  }, [showCategory]);

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
    <div className={`${styles.container} ${showCategory ? styles.show : undefined}`}>
      <div className={styles.categoryContainer}>
        <div className={styles.categoryWrapper}>
          {isLoggedIn ? (
            <div className={styles.profileItem}>
              <li className={styles.categoryItem} onClick={handleLogout}>
                로그아웃
              </li>
              <div className={styles.userImageWrapper}>
                <img src={currentUserImage} className={styles.userImage} alt="user-image" />
              </div>
            </div>
          ) : (
            <li
              className={styles.categoryItem}
              onClick={() => {
                router.push("/login");
              }}
            >
              로그인
            </li>
          )}
        </div>
      </div>
      <div className={styles.categoryContainer}>
        <div>게시판</div>
        <div className={styles.categoryWrapper}>
          <li className={styles.categoryItem} onClick={handleCalendarButton}>
            달력
          </li>
          <li className={styles.categoryItem} onClick={handleRandomButton}>
            랜덤
          </li>
        </div>
      </div>
      <div className={styles.categoryContainer}>
        <div>장르</div>
        <div className={styles.categoryWrapper}>
          {Object.keys(GENRES).map((category: string) => (
            <Link key={category} href={toGenrePage(pathName, category)}>
              <li className={styles.categoryItem}>{GENRES[category]}</li>
            </Link>
          ))}
        </div>
      </div>
      {isAdminPage(pathName) && (
        <div className={styles.categoryContainer}>
          <div>관리자 메뉴</div>
          <div className={styles.categoryWrapper}>
            <li
              className={styles.categoryItem}
              onClick={() => {
                router.push("/admin/upload");
              }}
            >
              글쓰기
            </li>
          </div>
        </div>
      )}
      <div className={styles.categoryContainer}>
        <a href="https://github.com/minumsa/carver-music" target="_blank">
          <div className={styles.githubIcon}></div>
        </a>
      </div>
    </div>
  );
};
