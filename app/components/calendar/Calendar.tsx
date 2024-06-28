"use client";

import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import styles from "./Calendar.module.css";
import { fetchCalendarDataCSR } from "@/app/modules/api";
import { getYearMonth } from "@/app/modules/utils";
import { useRouter } from "next/navigation";
// import "react-calendar/dist/Calendar.css";

interface CalendarData {
  album: string;
  artist: string;
  id: string;
  imgUrl: string;
  uploadDate: string;
}

interface CalendarComponentProps {
  calendarData: any;
}

// TODO: 기능 구현 끝나면 any 타입 정상적으로 다 바꾸기
const CalendarComponent = ({ calendarData }: CalendarComponentProps) => {
  const [currentDate, setCurrentDate] = useState<any>(new Date());
  const [currentCalendarData, setCurrentCalendarData] = useState<any>();
  const today = new Date();
  const router = useRouter();

  useEffect(() => {
    setCurrentCalendarData(calendarData);
  }, []);

  const handleDateChange = (date: any) => {
    setCurrentDate(date);
  };

  const toPostPage = (id: string) => {
    router.push(`/post/${id}`);
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const event = currentCalendarData?.find(
        (event: any) => new Date(event.uploadDate).toDateString() === date.toDateString(),
      );

      return event ? (
        <div className={styles.event}>
          <img
            src={event.imgUrl}
            alt={event.album}
            onClick={() => {
              toPostPage(event.id);
            }}
          />
        </div>
      ) : null;
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
    const response = await fetchCalendarDataCSR(activeStartDate);
    setCurrentCalendarData(response);
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
      {/* <button className={styles.todayButton} onClick={goToToday}>
        오늘
      </button> */}
      <Calendar
        calendarType="gregory"
        onChange={handleDateChange}
        value={currentDate}
        tileContent={tileContent}
        tileClassName={tileClassName}
        onActiveStartDateChange={({ activeStartDate }) => getCaldendarData(activeStartDate)}
        // navigationLabel={renderCustomNavigation}
        // tileDisabled={tileDisabled}
        minDetail={"month"}
        // activeStartDate={activeStartDate}
      />
    </div>
  );
};

export default CalendarComponent;
