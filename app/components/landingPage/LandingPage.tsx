"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "./LandingPage.module.css";
import { AlbumFilters, fetchAlbumData } from "../../modules/api";
import { usePathname } from "next/navigation";
import { useAtom, useSetAtom } from "jotai";
import React from "react";
import { useInView } from "react-intersection-observer";
import "aos/dist/aos.css";
import Link from "next/link";
import { BlurImg } from "../@common/BlurImg";
import { AlbumInfo } from "../../modules/types";
import {
  tagAtom,
  albumDataAtom,
  totalScrollCountAtom,
  scrollCountAtom,
  scrollPositionAtom,
  isScrollingAtom,
} from "../../modules/atoms";
import { toArtistPage, toPostPage } from "../../modules/paths";
import { MIN_SCROLL_COUNT, PER_PAGE_COUNT } from "../../modules/constants";
import { ScrollingIcon } from "./ScrollingIcon";
import MobileLoadingView from "../@common/MobileLoadingView";
import MobileTagDisplay from "./MobileTagDisplay";
import { useUpdateScroll } from "@/app/hooks/useUpdateScroll";
import { useResetScroll } from "@/app/hooks/useResetScroll";

interface LandingPageProps {
  initialData: AlbumInfo[];
  initialTotalScrollCount: number;
}

const UNREACHABLE_SCROLL_LIMIT = 10000;

export const LandingPage = ({ initialData, initialTotalScrollCount }: LandingPageProps) => {
  const pathName = usePathname();
  const [data, setData] = useAtom(albumDataAtom);
  const [scrollCount, setScrollCount] = useAtom(scrollCountAtom);
  const [totalScrollCount, setTotalScrollCount] = useAtom(totalScrollCountAtom);
  const [isScrolling, setIsScrolling] = useAtom(isScrollingAtom);
  const setScrollPosition = useSetAtom(scrollPositionAtom);
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });
  const [currentTag, setCurrentTag] = useAtom(tagAtom);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isFirstFetch = scrollCount === 1;

  useEffect(() => {
    // TODO: Aos 애니메이션 임시 미사용 상태, 아예 삭제할지 말지 결정하기
    // Aos.init();
  }, []);

  useResetScroll();
  useUpdateScroll(inView);

  const loadData = useCallback(
    async (scrollCount: number) => {
      try {
        const albumFilters: AlbumFilters = {
          scrollCount,
          currentTag,
        };
        const { albumData, albumDataCount } = await fetchAlbumData(albumFilters);

        if (isFirstFetch) {
          setData(albumData);
        } else {
          setData((prevData) => [...prevData, ...albumData]);
        }

        if (currentTag) {
          const totalScrollCount = Math.ceil(albumDataCount / PER_PAGE_COUNT);
          setTotalScrollCount(totalScrollCount);
        }
      } catch (error) {
        console.error("Failed to fetch album data : ", error);
      } finally {
        setIsLoading(false);
        setIsScrolling(false);
      }
    },
    [isFirstFetch, currentTag],
  );

  useEffect(() => {
    const isInitialScroll = !currentTag && scrollCount === MIN_SCROLL_COUNT;
    const scrollDetected =
      inView && scrollCount > MIN_SCROLL_COUNT && scrollCount <= totalScrollCount;
    const mobileTagButtonClicked = currentTag && scrollCount === MIN_SCROLL_COUNT;
    const hasNoData = totalScrollCount === 0;
    const hasReachedScrollLimit = scrollCount === totalScrollCount;

    // 처음 메인화면으로 진입한 경우
    if (isInitialScroll) {
      setData(initialData);
      setTotalScrollCount(initialTotalScrollCount);
    }

    // 무한 스크롤이 감지된 경우 또는 태그 버튼을 클릭한 경우
    if (scrollDetected || mobileTagButtonClicked) loadData(scrollCount);

    // 모바일: 모바일 화면에서 태그 버튼을 클릭 시
    if (mobileTagButtonClicked && hasNoData) setIsLoading(true);

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
      <MobileTagDisplay currentTag={currentTag} setCurrentTag={setCurrentTag} />
      <MobileLoadingView isLoading={isLoading} />
      <ScrollingIcon isScrolling={isScrolling} />
      <div className={styles.container}>
        {data.map((item, index) => {
          const isCurrentLastItem = index + 1 === data.length;
          const { imgUrl, blurHash, album, id, artist, artistId } = item;
          return (
            <div
              // data-aos="fade-up"
              // data-aos-duration={400}
              // data-aos-offset={isMobile ? 40 : 90}
              // data-aos-once="true"
              key={id}
              className={styles.itemContainer}
              ref={isCurrentLastItem ? ref : undefined}
            >
              <Link href={toPostPage(pathName, id)} onClick={updateScrollPosition}>
                <div className={styles.albumImageWrapper}>
                  <BlurImg className={styles.albumImage} blurHash={blurHash} src={imgUrl} />
                </div>
              </Link>
              <div className={styles.albumMetadataContainer}>
                <Link href={toPostPage(pathName, id)} onClick={updateScrollPosition}>
                  <button className={styles.albumItem} aria-label={`Album: ${album}`}>
                    {album}
                  </button>
                </Link>
                <br />
                <Link href={toArtistPage(pathName, artistId)} onClick={updateScrollPosition}>
                  <button className={styles.albumItem} aria-label={`Artist: ${artist}`}>
                    {artist}
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
