"use client";

import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import styles from "./Calendar.module.css";
import { fetchCalendarDataCSR } from "@/app/modules/api/album";
import { usePathname, useRouter } from "next/navigation";
import { CalendarData } from "@/app/modules/types";
import { useAtom } from "jotai";
import { currentCalendarDataAtom, currentDateAtom } from "@/app/modules/atoms";
import { toCalendarDetailPage } from "@/app/modules/paths";
import { LoadingIcon } from "../landingPage/LoadingIcon";
import SpinningCircles from "react-loading-icons/dist/esm/components/spinning-circles";
// import "react-calendar/dist/Calendar.css";

interface CalendarComponentProps {
  calendarData: CalendarData[];
}

// TODO: 기능 구현 끝나면 any 타입 정상적으로 다 바꾸기
const CalendarComponent = ({ calendarData }: CalendarComponentProps) => {
  const [currentDate, setCurrentDate] = useAtom(currentDateAtom);
  const [currentCalendarData, setCurrentCalendarData] = useAtom(currentCalendarDataAtom);
  const today = new Date();
  const pathName = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!currentCalendarData) setCurrentCalendarData(calendarData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDateChange = (value: any) => {
    setCurrentDate(value);
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const events = currentCalendarData?.filter(
        (event: any) => new Date(event.uploadDate).toDateString() === date.toDateString(),
      );
      const totalContents = events?.length ?? 0;
      const hasVariousContents = totalContents >= 2;

      return events?.map((event: any, index: number) => {
        const clickedDate = event.uploadDate.slice(0, 10);
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

  const getCaldendarData = async (activeStartDate: any) => {
    try {
      setIsLoading(true);
      const response = await fetchCalendarDataCSR(activeStartDate);
      setCurrentCalendarData(response);
    } catch (error) {
      console.error("Failed to fetch calendar data");
    } finally {
      setIsLoading(false);
    }
  };

  const goToToday = async () => {
    setCurrentDate(today);
    getCaldendarData(today);
  };

  const tileDisabled = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      return date.getMonth() !== currentDate.getMonth();
    }
    return false;
  };

  return (
    <div className={styles.container}>
      {isLoading && <SpinningCircles className={styles.spinningCircles} />}
      <Calendar
        calendarType="gregory"
        onChange={handleDateChange}
        value={currentDate}
        tileContent={tileContent}
        tileClassName={tileClassName}
        onActiveStartDateChange={({ activeStartDate }) => getCaldendarData(activeStartDate)}
        minDetail={"month"}
        // navigationLabel={renderCustomNavigation}
        // tileDisabled={tileDisabled}
        // activeStartDate={activeStartDate}
      />
    </div>
  );
};

export default CalendarComponent;
