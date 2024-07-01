"use client";

import { CalendarData } from "@/app/modules/types";
import styles from "./CalendarMonth.module.css";

interface CalendarMonthProps {
  calendarData: CalendarData[];
}

export const CalendarMonth = ({ calendarData }: CalendarMonthProps) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.month}></h3>
    </div>
  );
};
