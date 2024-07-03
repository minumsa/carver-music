import { GENRES } from "@/app/modules/constants";
import styles from "./MobileMenu.module.css";
import Link from "next/link";
import { toCalendarPage, toGenrePage, toPostPage } from "@/app/modules/paths";
import { usePathname, useRouter } from "next/navigation";
import { fetchRandomAlbumId } from "@/app/modules/api";
import { isAdminPage } from "@/app/modules/utils";

interface MobileMenuProps {
  showCategory: boolean;
}

export const MobileMenu = ({ showCategory }: MobileMenuProps) => {
  const pathName = usePathname();
  const router = useRouter();

  async function handleRandomButton() {
    const randomId = await fetchRandomAlbumId();
    router.push(toPostPage(pathName, randomId));
  }

  function handleCalendarButton() {
    router.push(toCalendarPage(pathName));
  }

  return (
    <div className={`${styles.container} ${showCategory ? styles.show : undefined}`}>
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
