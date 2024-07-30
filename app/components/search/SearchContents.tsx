"use client";

import React, { useEffect, useState } from "react";
import { AlbumContents } from "../@common/album/AlbumContents";
import { ContentLayout } from "../@common/ContentLayout";
import styles from "./SearchContents.module.css";
import { usePathname, useRouter } from "next/navigation";
import { AlbumData } from "../../modules/types";
import { isAdminPage } from "../../modules/utils";
import { SearchTagDisplay } from "./SearchTagDisplay";
import { DEFAULT_TAGS } from "@/app/modules/constants/tags";

interface SearchInfo {
  activeKeyword: string;
  activePage: number;
  activeTagName: string;
  totalDataLength: number;
}

interface SearchContentProps {
  data: AlbumData[];
  searchInfo: SearchInfo;
}

export default function SearchContents({ data, searchInfo }: SearchContentProps) {
  const { activeKeyword, activePage, activeTagName, totalDataLength } = searchInfo;
  const router = useRouter();
  const pathName = usePathname();
  const decodedKeyword = decodeURIComponent(activeKeyword);
  const [keyword, setKeyword] = useState("");
  const [activeText, setCurrentText] = useState(
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

    if (activeTagName) {
      setCurrentText(
        `${DEFAULT_TAGS[activeTagName]} 태그에 관련된 총 ${totalDataLength}건의 검색 결과`,
      );
    }
  }, [activeTagName, decodedKeyword, totalDataLength]);

  return (
    <ContentLayout activePage={activePage} dataCount={totalDataLength}>
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
        <p className={styles.searchResultText}>{activeText}</p>
        <SearchTagDisplay activeTag={activeTagName} />
      </div>
      {data && <AlbumContents albumData={data} />}
    </ContentLayout>
  );
}
