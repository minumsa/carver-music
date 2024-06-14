"use client";

import React, { useState } from "react";
import { AlbumContents } from "../@common/album/AlbumContents";
import { ContentLayout } from "../@common/ContentLayout";
import styles from "./SearchContent.module.css";
import { usePathname, useRouter } from "next/navigation";
import { AlbumInfo } from "../../modules/types";
import { isAdminPage } from "../../modules/utils";
import { SearchTagDisplay } from "./SearchTagDisplay";

interface SearchInfo {
  currentKeyword: string;
  currentPage: number;
  currentTagName: string;
  totalDataLength: number;
}

interface SearchContentProps {
  data: AlbumInfo[];
  searchInfo: SearchInfo;
}

export default function SearchContent({ data, searchInfo }: SearchContentProps) {
  const { currentKeyword, currentPage, currentTagName, totalDataLength } = searchInfo;
  const router = useRouter();
  const pathName = usePathname();
  const decodedKeyword = decodeURIComponent(currentKeyword);
  const [keyword, setKeyword] = useState("");
  // "모두 보기" 태그(버튼)은 모바일 메인 화면에서만 표시되도록 함

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  async function handleSearch() {
    isAdminPage(pathName)
      ? router.push(`/admin/search/${keyword}/1`)
      : router.push(`/search/${keyword}/1`);
  }

  return (
    <ContentLayout currentPage={currentPage} dataCount={totalDataLength}>
      <div className={styles.searchInputContainer}>
        <div className={styles.searchPageInputContainer}>
          <input
            className={styles.searchPageInput}
            placeholder="앨범, 아티스트, 키워드 검색"
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
            onKeyDown={handleEnter}
          />
          <img
            className={styles.searchPageInputIcon}
            src={"/svgs/magnifying-glass.svg"}
            alt="search-page-input-icon"
          />
        </div>
        <p className={styles.searchResultContainer}>
          {decodedKeyword
            ? totalDataLength
              ? `"${decodedKeyword}"에 관련된 총 ${totalDataLength}건의 검색 결과`
              : `"${decodedKeyword}"에 관련된 검색 결과가 없습니다.`
            : "앨범 제목, 아티스트 또는 키워드 등을 검색해보세요."}
        </p>
        <SearchTagDisplay currentTagName={currentTagName} />
      </div>
      {data && <AlbumContents albumData={data} />}
    </ContentLayout>
  );
}
