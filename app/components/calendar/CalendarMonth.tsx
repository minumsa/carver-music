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

  return (
    <div className={styles.container}>
      <h3 className={styles.month}></h3>
    </div>
  );
};
