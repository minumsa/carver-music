import styles from "./Category.module.css";
import Link from "next/link";
import { Hamburger } from "./Hamburger";
import { useSetAtom } from "jotai";
import {
  albumDataAtom,
  scrollCountAtom,
  scrollPositionAtom,
  tagAtom,
  totalScrollCountAtom,
} from "../../../modules/atoms";
import { isAdminPage, isLandingPage } from "../../../modules/utils";
import { toSearchPage } from "../../../modules/paths";
import { usePathname } from "next/navigation";
import { SITE_TITLE } from "@/app/modules/config";

export const Category = () => {
  const pathName = usePathname();
  const setCurrentTagKey = useSetAtom(tagAtom);
  const setAlbumData = useSetAtom(albumDataAtom);
  const setScrollCount = useSetAtom(scrollCountAtom);
  const setTotalScrollCount = useSetAtom(totalScrollCountAtom);
  const setScrollPosition = useSetAtom(scrollPositionAtom);

  const resetDataAndScroll = () => {
    setAlbumData([]);
    setScrollCount(1);
    setTotalScrollCount(0);
    setScrollPosition(0);
    setCurrentTagKey("");
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className={styles.container}>
      {/* 햄버거 메뉴 */}
      <Hamburger />
      <div className={styles.navContainer}>
        <div className={styles.navWrapper}>
          {/* 사이트 제목 */}
          {isLandingPage(pathName) ? (
            <nav className={styles.title} onClick={scrollToTop}>
              {SITE_TITLE}
            </nav>
          ) : (
            <Link
              className={styles.title}
              href={isAdminPage(pathName) ? "/admin" : "/"}
              onClick={resetDataAndScroll}
            >
              <nav>{SITE_TITLE}</nav>
            </Link>
          )}
        </div>
      </div>
      {/* 검색 아이콘 */}
      <Link href={toSearchPage(pathName)}>
        <nav className={styles.magnifyingGlass}></nav>
      </Link>
    </div>
  );
};
