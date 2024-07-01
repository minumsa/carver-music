"use client";

import { CalendarData } from "@/app/modules/types";
import styles from "./CalendarMonth.module.css";

interface CalendarMonthProps {
  calendarData: CalendarData[];
}

interface GroupedCalendarData {
  [date: string]: {
    album: string;
    artist: string;
    id: string;
    imgUrl: string;
  }[];
}

export const CalendarMonth = ({ calendarData }: CalendarMonthProps) => {
  const month = new Date(calendarData[0].uploadDate).getMonth() + 1;
  const groupedCalendarDataByDate = calendarData.reduce<GroupedCalendarData>(
    (acc, calendarData) => {
      const { album, artist, id, imgUrl, uploadDate } = calendarData;
      const date = uploadDate.split("T")[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push({ album, artist, id, imgUrl });
      return acc;
    },
    {},
  );

  function goBack() {
    window.history.back();
  }

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
    </div>
  );
};
