"use client";

import { useEffect, useState } from "react";
import styles from "./Grid.module.css";
import { AlbumFilters, fetchAlbumData } from "../../modules/api";
import { usePathname } from "next/navigation";
import { useAtom, useAtomValue } from "jotai";
import React from "react";
import { useInView } from "react-intersection-observer";
import "aos/dist/aos.css";
import Aos from "aos";
import { ContentLayout } from "../@common/ContentLayout";
import Link from "next/link";
import { BlurImg } from "../@common/BlurImg";
import { isMobile } from "react-device-detect";
import { LoadingView } from "../@common/LoadingView";
import { AlbumInfo } from "../../modules/types";
import {
  tagKeyAtom,
  albumDataAtom,
  totalScrollCountAtom,
  scrollCountAtom,
  scrollPositionAtom,
  isFirstFetchAtom,
} from "../../modules/atoms";

import { toArtistPage, toPostPage } from "../../modules/paths";
import { MobileTagDisplay } from "./MobileTagDisplay";
import { PER_PAGE_COUNT } from "../../modules/constants";
import { ScrollingIcon } from "./ScrollingIcon";

interface GridProps {
  initialData: AlbumInfo[];
  totalScrollCount: number;
}

const UNREACHABLE_SCROLL_LIMIT = 10000;

export const Grid = ({ initialData, totalScrollCount }: GridProps) => {
  const pathName = usePathname();
  const [data, setData] = useAtom(albumDataAtom);
  const [scrollCount, setScrollCount] = useAtom(scrollCountAtom);
  const [scrollPosition, setScrollPosition] = useAtom(scrollPositionAtom);
  const [newTotalScrollCount, setNewTotalScrollCount] = useAtom(totalScrollCountAtom);
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });
  const currentTagKey = useAtomValue(tagKeyAtom);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFirstFetch, setIsFirstFetch] = useAtom(isFirstFetchAtom);

  useEffect(() => {
    Aos.init();
    setIsFirstFetch(true);
  }, []);

  useEffect(() => {
    const scrolledBefore = scrollPosition > 0;
    function scrollAndReset() {
      window.scrollTo(0, scrollPosition);
      setScrollPosition(0);
    }

    if (scrolledBefore) {
      scrollAndReset();
    }
  }, []);

  useEffect(() => {
    const isScrollAtOrBelowLimit = scrollCount <= newTotalScrollCount;
    if (inView) {
      if (isScrollAtOrBelowLimit) {
        setScrollCount(prevCount => prevCount + 1);
        setIsScrolling(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    async function loadData(scrollCount: number) {
      const albumFilters: AlbumFilters = {
        scrollCount,
        currentTagKey,
      };

      const { albumData, albumDataCount } = await fetchAlbumData(albumFilters);
      setData(prevData => [...prevData, ...albumData]);
      setIsScrolling(false);
      setIsLoading(false);

      if (currentTagKey) {
        const tmp = Math.max(1, Math.ceil(albumDataCount / PER_PAGE_COUNT));
        setNewTotalScrollCount(tmp);
      }

      if (isFirstFetch) {
        setIsFirstFetch(false);
      }
    }

    const isInitialScroll = currentTagKey === "" && scrollCount === 1;
    const scrollDetected =
      data.length >= 1 && scrollCount > 1 && scrollCount <= newTotalScrollCount;
    const tagButtonClicked = currentTagKey.length > 0 && scrollCount === 1;
    const hasReachedScrollLimit = scrollCount === newTotalScrollCount;
    const hasNoData = newTotalScrollCount === 0;

    // 클라이언트 사이드에서 처음 fetch할 때만 로딩 화면 보여주기
    if (isFirstFetch && hasNoData) {
      setIsLoading(true);
    }

    // 메인화면으로 진입한 경우
    if (isInitialScroll) {
      setData(initialData);
      setNewTotalScrollCount(totalScrollCount);
      setIsLoading(false);
      // 데이터가 있는 상태에서 뒤로 가기 시 또는 태그 버튼을 클릭한 경우
    }

    if (scrollDetected) {
      loadData(scrollCount);
    }

    if (tagButtonClicked) {
      loadData(scrollCount);
      setNewTotalScrollCount(0);
    }

    // scrollCount가 한계치에 도달하는 경우 더 이상 스크롤 이벤트가 발생하지 않도록 처리
    if (hasReachedScrollLimit) {
      setScrollCount(UNREACHABLE_SCROLL_LIMIT);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, scrollCount, currentTagKey, newTotalScrollCount]);

  function updateScrollPosition() {
    setScrollPosition(window.scrollY);
  }

  return (
    <>
      {/* 모바일 - 태그 컴포넌트 */}
      <MobileTagDisplay />

      <ContentLayout currentPage={scrollCount} dataCount={0}>
        <LoadingView isLoading={isLoading} />
        <ScrollingIcon isScrolling={isScrolling} />
        <div className={styles["container"]}>
          {data.map((item, index) => {
            const totalItemCount = data.length;
            const isLastDataOdd = index === totalItemCount - 1 && totalItemCount % 2 === 1;
            const isLastItem = index + 2 === data.length;
            const imgUrl = item.imgUrl;
            const blurHash = item.blurHash ?? "";
            return isLastDataOdd ? null : (
              <div
                data-aos="fade-up"
                data-aos-duration={500}
                data-aos-offset={isMobile ? 40 : 90}
                data-aos-once="true"
                key={index}
                className={`${styles["item-container"]}`}
                ref={isLastItem ? ref : undefined}
              >
                <Link href={toPostPage(pathName, item.id)} onClick={updateScrollPosition}>
                  <div className={styles["album-image-container"]}>
                    <BlurImg
                      className={styles["album-image"]}
                      blurHash={blurHash}
                      src={imgUrl}
                      punch={1}
                    />
                  </div>
                </Link>
                <div className={styles["album-metadata"]}>
                  <Link href={toPostPage(pathName, item.id)} onClick={updateScrollPosition}>
                    <button
                      className={styles["album-item"]}
                      aria-label={`Album: ${item.album}`}
                    >{`${item.album}`}</button>
                  </Link>
                  <br />
                  <Link href={toArtistPage(pathName, item.artistId)} onClick={updateScrollPosition}>
                    <button
                      className={styles["album-item"]}
                      aria-label={`Artist: ${item.artist}`}
                    >{`${item.artist}`}</button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </ContentLayout>
    </>
  );
};
