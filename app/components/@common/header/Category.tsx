import styles from "./Category.module.css";
import Link from "next/link";
import { Hamburger } from "./Hamburger";
import { usePathname } from "next/navigation";
import { useAtom } from "jotai";
import { tagAtom } from "../../../modules/atoms";
import { isAdminPage } from "../../../modules/utils";
import { toSearchPage } from "../../../modules/paths";
import { SITE_TITLE } from "@/app/modules/constants";

export const Category = () => {
  const pathName = usePathname();
  const [currentTagKey, setCurrentTagKey] = useAtom(tagAtom);
  const isMainPage = pathName === "/" || pathName === "/admin";

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
          {isMainPage ? (
            <nav className={styles.title} onClick={scrollToTop}>
              {SITE_TITLE}
            </nav>
          ) : (
            <Link
              className={styles.title}
              href={isAdminPage(pathName) ? "/admin" : ""}
              onClick={() => {
                setCurrentTagKey("");
              }}
            >
              <nav>{SITE_TITLE}</nav>
            </Link>
          )}
        </div>
      </div>
      {/* 검색 아이콘 */}
      <Link
        href={toSearchPage(pathName)}
        onClick={() => {
          setCurrentTagKey("");
        }}
      >
        <nav className={styles.searchIcon}></nav>
      </Link>
    </div>
  );
};
