"use client";

import { CalendarData } from "@/app/modules/types";
import styles from "./CalendarMonth.module.css";
import { PRIMARY_COLOR } from "@/app/modules/constants";
import { useEffect, useRef } from "react";

interface CalendarMonthProps {
  calendarData: CalendarData[];
  day: number;
}

interface GroupedCalendarData {
  [date: string]: {
    album: string;
    artist: string;
    id: string;
    imgUrl: string;
    score: number;
  }[];
}

export const CalendarMonth = ({ calendarData, day }: CalendarMonthProps) => {
  const month = new Date(calendarData[0].uploadDate).getMonth() + 1;
  const groupedCalendarDataByDate = calendarData.reduce<GroupedCalendarData>(
    (acc, calendarData) => {
      const { album, artist, id, imgUrl, uploadDate, score } = calendarData;
      const date = uploadDate.split("T")[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push({ album, artist, id, imgUrl, score });
      return acc;
    },
    {},
  );

  function goBack() {
    window.history.back();
  }

  const clickedDayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (clickedDayRef.current) {
      clickedDayRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  }, [day]);

  return (
    <div className={styles.container}>
      <div className={styles.arrowLeft}>
        <img
          src="/svgs/arrow-left.svg"
          alt="arrow-left"
          onClick={goBack}
          style={{ cursor: "pointer" }}
        />
      </div>
      <h3 className={styles.month}>{month}월</h3>
      {Object.keys(groupedCalendarDataByDate).map((date) => {
        const dataCountByDate = groupedCalendarDataByDate[date].length;
        const dayFromDate = new Date(date).getDate();
        const isClickedDay = day === dayFromDate;

        return (
          <div
            key={date}
            className={styles.dateGroupContainer}
            ref={isClickedDay ? clickedDayRef : null}
          >
            <div className={styles.dateGroupTitle}>
              <div
                className={styles.dateToNumber}
                style={{ color: isClickedDay ? PRIMARY_COLOR : undefined }}
              >
                {dayFromDate}
              </div>
              <div className={styles.dataCountByDate}>{`${dataCountByDate}개`}</div>
            </div>
            <div className={styles.dateGroup}>
              {groupedCalendarDataByDate[date].map((calendarData) => {
                const { artist, album, imgUrl, score } = calendarData;
                const percentageScore = 100 - score * 20;
                return (
                  <div key={album} className={styles.albumInfoContainer}>
                    <div className={styles.albumArtWrapper}>
                      <img src={imgUrl} alt={album} />
                    </div>
                    <div className={styles.ellipsis}>{artist}</div>
                    <div className={styles.ellipsis}>{album}</div>
                    {/* FIXME: 별 이미지 svg로 교체 */}
                    <div className={styles.starContainer}>
                      <img
                        className={styles.coloredStar}
                        src="/images/star-color.webp"
                        alt="colored-star"
                        style={
                          score
                            ? {
                                clipPath: `inset(0 ${percentageScore}% 0 0)`,
                              }
                            : undefined
                        }
                        loading="lazy"
                      />
                      <img
                        className={styles.monoStar}
                        src="/images/star-mono.webp"
                        alt="mono-star"
                        loading="lazy"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
