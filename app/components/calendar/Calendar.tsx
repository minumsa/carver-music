"use client";

import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import styles from "./Calendar.module.css";
import { fetchCalendarDataCSR } from "@/app/modules/api/album";
import { usePathname, useRouter } from "next/navigation";
import { CalendarData } from "@/app/modules/types";
import { useAtom } from "jotai";
import { activeCalendarDataAtom, activeDateAtom } from "@/app/modules/atoms";
import { toCalendarDetailPage } from "@/app/modules/paths";
import SpinningCircles from "react-loading-icons/dist/esm/components/spinning-circles";
// import "react-calendar/dist/Calendar.css";

interface CalendarComponentProps {
  initialCalendarData: CalendarData[];
}

const CalendarComponent = ({ initialCalendarData }: CalendarComponentProps) => {
  const [activeDate, setActiveDate] = useAtom(activeDateAtom);
  const [activeCalendarData, setActiveCalendarData] = useAtom(activeCalendarDataAtom);
  const today = new Date();
  const pathName = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 최초 페이지 진입 시(activeCalendarData가 없을 때)에만 SSR을 통해 가져온 달력 데이터 사용
    setActiveCalendarData(initialCalendarData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDateChange = (value: any) => {
    setActiveDate(value);
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const events = activeCalendarData?.filter(
        (event: any) => new Date(event.uploadDate).toDateString() === date.toDateString(),
      );
      const totalContents = events?.length ?? 0;
      const hasVariousContents = totalContents >= 2;

      return events?.map((event: any, index: number) => {
        const clickedDate = event.uploadDate.split("T")[0];
        return (
          <div key={index} className={styles.event}>
            {hasVariousContents && <div className={styles.totalContents}>{totalContents}</div>}
            <img
              src={event.imgUrl}
              alt={event.album}
              onClick={() => {
                router.push(toCalendarDetailPage(pathName, clickedDate));
              }}
            />
          </div>
        );
      });
    }
    return null;
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const classes = [styles.tile];
      const isToday = date.toDateString() === today.toDateString();
      if (isToday) {
        classes.push(styles.today);
      }
      return classes.join(" ");
    }
    return "";
  };

  const getCaldendarData = async (activeStartDate: Date | null) => {
    try {
      setIsLoading(true);
      if (activeStartDate) {
        const response = await fetchCalendarDataCSR(activeStartDate);
        setActiveCalendarData(response);
      }
    } catch (error) {
      console.error("Failed to fetch calendar data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {isLoading && <SpinningCircles className={styles.spinningCircles} />}
      <Calendar
        calendarType="gregory"
        onChange={handleDateChange}
        value={activeDate}
        tileContent={tileContent}
        tileClassName={tileClassName}
        onActiveStartDateChange={({ activeStartDate }) => getCaldendarData(activeStartDate)}
        minDetail={"month"}
      />
    </div>
  );
};

export default CalendarComponent;
