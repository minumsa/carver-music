import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SUB_PER_PAGE_COUNT } from "../../../modules/constants";
import styles from "./Test.module.css";

interface PageNumbersProps {
  currentPage: number;
  dataCount: number;
}

const PAGE_SIZE = 5;

export const PageNumbers = ({ currentPage, dataCount }: PageNumbersProps) => {
  const router = useRouter();
  const [totalPageCount, setTotalPageCount] = useState(1);
  const pageArray = Array.from({ length: totalPageCount }, (_, i) => i + 1);
  const pathName = usePathname();
  const pathNameWithoutPageNumber = pathName.replace(/\/\d+$/, "");
  const [maxPage, setMaxPage] = useState<number>(PAGE_SIZE);

  useEffect(() => {
    setMaxPage(Math.ceil(currentPage / SUB_PER_PAGE_COUNT) * SUB_PER_PAGE_COUNT);
  }, [currentPage]);

  useEffect(() => {
    if (dataCount) setTotalPageCount(Math.max(1, Math.ceil(dataCount / SUB_PER_PAGE_COUNT)));
  }, [dataCount]);

  const handlePageClick = (pageNumber: number) => {
    router.push(`${pathNameWithoutPageNumber}/${pageNumber}`);
  };

  const goToPrevPage = () => {
    if (maxPage > PAGE_SIZE) {
      const prevPageBlock = maxPage - PAGE_SIZE;
      handlePageClick(prevPageBlock);
    }
  };

  const goToNextPage = () => {
    const nextPageBlock = maxPage + 1;
    handlePageClick(nextPageBlock);
  };

  return (
    <footer className={styles["page-container"]}>
      {currentPage > PAGE_SIZE && (
        <div className={styles["page"]} onClick={goToPrevPage}>
          〈
        </div>
      )}
      {pageArray.map((page, index) => {
        const minPage = maxPage - SUB_PER_PAGE_COUNT + 1;
        const pageNumber = index + 1;
        const isPageNumberInRange = pageNumber >= minPage && pageNumber <= maxPage;
        const isCurrentPageEqualPageNumber = currentPage == pageNumber;
        if (isPageNumberInRange) {
          return (
            <div
              key={index}
              className={styles["page"]}
              onClick={() => {
                router.push(`${pathNameWithoutPageNumber}/${pageNumber}`);
              }}
              style={isCurrentPageEqualPageNumber ? { color: "#cfcfcf" } : undefined}
            >
              {page}
            </div>
          );
        } else {
          return null;
        }
      })}
      {totalPageCount - maxPage > 0 && (
        <div className={styles["page"]} onClick={goToNextPage}>
          〉
        </div>
      )}
    </footer>
  );
};
