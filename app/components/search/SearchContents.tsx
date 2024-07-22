"use client";

import React, { useEffect, useState } from "react";
import { AlbumContents } from "../@common/album/AlbumContents";
import { ContentLayout } from "../@common/ContentLayout";
import styles from "./SearchContents.module.css";
import { usePathname, useRouter } from "next/navigation";
import { AlbumInfo } from "../../modules/types";
import { isAdminPage } from "../../modules/utils";
import { SearchTagDisplay } from "./SearchTagDisplay";
import { DEFAULT_TAGS } from "@/app/modules/constants/tags";

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

export default function SearchContents({ data, searchInfo }: SearchContentProps) {
  const { currentKeyword, currentPage, currentTagName, totalDataLength } = searchInfo;
  const router = useRouter();
  const pathName = usePathname();
  const decodedKeyword = decodeURIComponent(currentKeyword);
  const [keyword, setKeyword] = useState("");
  const [currentText, setCurrentText] = useState(
    "앨범 제목, 아티스트 또는 키워드 등을 검색해보세요.",
  );

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

  useEffect(() => {
    if (decodedKeyword) {
      if (totalDataLength) {
        setCurrentText(`"${decodedKeyword}"에 관련된 총 ${totalDataLength}건의 검색 결과`);
      } else {
        setCurrentText(`"${decodedKeyword}"에 관련된 검색 결과가 없습니다.`);
      }
    }

    if (currentTagName) {
      setCurrentText(
        `${DEFAULT_TAGS[currentTagName]} 태그에 관련된 총 ${totalDataLength}건의 검색 결과`,
      );
    }
  }, [currentTagName, decodedKeyword, totalDataLength]);

  return (
    <ContentLayout currentPage={currentPage} dataCount={totalDataLength}>
      <div className={styles.container}>
        <div className={styles.inputContainer}>
          <input
            className={styles.searchInput}
            placeholder="앨범, 아티스트, 키워드 검색"
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
            onKeyDown={handleEnter}
          />
          <img
            className={styles.magnifyingGlass}
            src={"/svgs/magnifying-glass.svg"}
            alt="magnifyingGlass"
          />
        </div>
        <p className={styles.searchResultText}>{currentText}</p>
        <SearchTagDisplay currentTag={currentTagName} />
      </div>
      {data && <AlbumContents albumData={data} />}
    </ContentLayout>
  );
}
