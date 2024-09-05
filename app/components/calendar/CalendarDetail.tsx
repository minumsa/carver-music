"use client";

import { CalendarData } from "@/app/modules/types";
import styles from "./CalendarDetail.module.css";
import { useEffect, useMemo, useRef } from "react";
import { CalendarDetailAlbumItem } from "./CalendarDetailAlbumItem";

interface CalendarDetailProps {
  calendarData: CalendarData[];
  day: number;
}

interface GroupedCalendarData {
  [date: string]: CalendarData[];
}

const PRIMARY_COLOR = "#007bff";

export const CalendarDetail = ({ calendarData, day }: CalendarDetailProps) => {
  const month = new Date(calendarData[0].uploadDate).getMonth() + 1;
  const groupedCalendarDataByDate = useMemo(() => {
    return calendarData.reduce<GroupedCalendarData>((acc, calendarData) => {
      const { album, artist, artistId, id, imgUrl, uploadDate, score } = calendarData;
      const date = uploadDate.split("T")[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push({
        album,
        artist,
        artistId,
        id,
        imgUrl,
        score,
        uploadDate: "",
      });
      return acc;
    }, {});
  }, [calendarData]);

  const sortedDates = useMemo(() => {
    return Object.keys(groupedCalendarDataByDate).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    );
  }, [groupedCalendarDataByDate]);

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
      {sortedDates.map((date) => {
        const dataCountByDate = groupedCalendarDataByDate[date].length;
        const totalCalendarDataByMonth = `${dataCountByDate}개`;
        const dayFromDate = new Date(date).getDate();
        const isClickedDay = day === dayFromDate;
        return (
          <div
            key={date}
            className={styles.dateGroupContainer}
            ref={isClickedDay ? clickedDayRef : null}
          >
            <div className={styles.dateHeaderWrapper}>
              <div
                className={styles.dateToNumber}
                style={{ color: isClickedDay ? PRIMARY_COLOR : undefined }}
              >
                {dayFromDate}
              </div>
              <div className={styles.dataCountByDate}>{totalCalendarDataByMonth}</div>
            </div>
            <div className={styles.dateGroup}>
              {groupedCalendarDataByDate[date].map((calendarData) => {
                return (
                  <CalendarDetailAlbumItem calendarData={calendarData} key={calendarData.id} />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
