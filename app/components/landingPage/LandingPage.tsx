"use client";

import { useEffect, useState } from "react";
import styles from "./LandingPage.module.css";
import { AlbumFilters, fetchAlbumData } from "../../modules/api";
import { usePathname } from "next/navigation";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import React from "react";
import { useInView } from "react-intersection-observer";
import "aos/dist/aos.css";
import Link from "next/link";
import { BlurImg } from "../@common/BlurImg";
import { LoadingView } from "../@common/LoadingView";
import { AlbumInfo } from "../../modules/types";
import {
  tagAtom,
  albumDataAtom,
  totalScrollCountAtom,
  scrollCountAtom,
  scrollPositionAtom,
  isFirstFetchAtom,
  isScrollingAtom,
} from "../../modules/atoms";
import { toArtistPage, toPostPage } from "../../modules/paths";
import { MobileTagDisplay } from "./MobileTagDisplay";
import { PER_PAGE_COUNT } from "../../modules/constants";
import { ScrollingIcon } from "./ScrollingIcon";
import useScrollReset from "@/app/hooks/useScrollReset";
import useScrollUpdate from "@/app/hooks/useScrollUpdate";

interface LandingPageProps {
  initialData: AlbumInfo[];
  initialTotalScrollCount: number;
}

const UNREACHABLE_SCROLL_LIMIT = 10000;

export const LandingPage = ({ initialData, initialTotalScrollCount }: LandingPageProps) => {
  const pathName = usePathname();
  const [data, setData] = useAtom(albumDataAtom);
  const [scrollCount, setScrollCount] = useAtom(scrollCountAtom);
  const setScrollPosition = useSetAtom(scrollPositionAtom);
  const [totalScrollCount, setTotalScrollCount] = useAtom(totalScrollCountAtom);
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });
  const currentTag = useAtomValue(tagAtom);
  const [isScrolling, setIsScrolling] = useAtom(isScrollingAtom);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFirstFetch, setIsFirstFetch] = useAtom(isFirstFetchAtom);

  useEffect(() => {
    // Aos.init();
    setIsFirstFetch(true);
  }, []);

  useScrollReset();
  useScrollUpdate(inView);

  useEffect(() => {
    async function loadData(scrollCount: number) {
      try {
        const albumFilters: AlbumFilters = {
          scrollCount,
          currentTag,
        };
        const { albumData, albumDataCount } = await fetchAlbumData(albumFilters);
        setData((prevData) => [...prevData, ...albumData]);
        setIsScrolling(false);

        if (currentTag) {
          const totalScrollCount = Math.max(1, Math.ceil(albumDataCount / PER_PAGE_COUNT));
          setTotalScrollCount(totalScrollCount);
        }
        if (isFirstFetch) setIsFirstFetch(false);
      } catch (error) {
        console.error("Failed to fetch album data : ", error);
      } finally {
        setIsLoading(false);
      }
    }

    const isInitialScroll = !currentTag && scrollCount === 1;
    const hasDataAndScrollDetected =
      data.length >= 1 && scrollCount > 1 && scrollCount <= totalScrollCount;
    const tagButtonClicked = currentTag && scrollCount === 1;
    const hasReachedScrollLimit = scrollCount === totalScrollCount;
    const hasNoData = totalScrollCount === 0;

    // 모바일: 클라이언트 사이드에서 처음 fetch할 때만 로딩 화면 보여주기
    if (isFirstFetch && hasNoData) setIsLoading(true);

    // 메인화면으로 진입한 경우
    if (isInitialScroll) {
      setData(initialData);
      setTotalScrollCount(initialTotalScrollCount);
      setIsLoading(false);
    }

    // 데이터가 있는 상태에서 뒤로 가기 시 또는 태그 버튼을 클릭한 경우
    if (hasDataAndScrollDetected || tagButtonClicked) {
      loadData(scrollCount);
      if (tagButtonClicked) setTotalScrollCount(0);
    }

    // scrollCount가 한계치에 도달하는 경우 더 이상 스크롤 이벤트가 발생하지 않도록 처리
    if (hasReachedScrollLimit) setScrollCount(UNREACHABLE_SCROLL_LIMIT);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, scrollCount, currentTag, totalScrollCount]);

  function updateScrollPosition() {
    setScrollPosition(window.scrollY);
  }

  return (
    <>
      {/* 모바일 - 태그 컴포넌트 */}
      <React.Fragment>
        <MobileTagDisplay />
      </React.Fragment>
      <LoadingView isLoading={isLoading} />
      <ScrollingIcon isScrolling={isScrolling} />
      <div className={styles.container}>
        {data.map((item, index) => {
          const isLastItem = index + 1 === data.length;
          const { imgUrl, blurHash, album, id, artist, artistId } = item;
          return (
            <div
              // data-aos="fade-up"
              // data-aos-duration={400}
              // data-aos-offset={isMobile ? 40 : 90}
              // data-aos-once="true"
              key={index}
              className={`${styles.itemContainer}`}
              ref={isLastItem ? ref : undefined}
            >
              <Link href={toPostPage(pathName, id)} onClick={updateScrollPosition}>
                <div className={styles.albumImageContainer}>
                  <BlurImg className={styles.albumImage} blurHash={blurHash} src={imgUrl} />
                </div>
              </Link>
              <div className={styles.albumMetadata}>
                <Link href={toPostPage(pathName, id)} onClick={updateScrollPosition}>
                  <button
                    className={styles.albumItem}
                    aria-label={`Album: ${album}`}
                  >{`${album}`}</button>
                </Link>
                <br />
                <Link href={toArtistPage(pathName, artistId)} onClick={updateScrollPosition}>
                  <button
                    className={styles.albumItem}
                    aria-label={`Artist: ${artist}`}
                  >{`${artist}`}</button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
