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

  const renderCustomNavigation = ({ date, view, label, onClickPrevious, onClickNext }: any) => {
    const handleTodayClick = () => {
      setCurrentDate(new Date());
    };

    return (
      <div className={styles.navigation}>
        <button
          type="button"
          className="react-calendar__navigation__prev-button"
          onClick={onClickPrevious}
        >
          &lt;
        </button>
        <span className="react-calendar__navigation__label">{label}</span>
        <button
          type="button"
          className="react-calendar__navigation__next-button"
          onClick={onClickNext}
        >
          &gt;
        </button>
        <button type="button" className={styles.todayButton} onClick={handleTodayClick}>
          오늘
        </button>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <Calendar
        calendarType="gregory"
        onChange={handleDateChange}
        value={currentDate}
        tileContent={tileContent}
        tileClassName={tileClassName}
        onActiveStartDateChange={({ activeStartDate }) => getCaldendarData(activeStartDate)}
        // navigationLabel={renderCustomNavigation}
      />
    </div>
  );
};

export default CalendarComponent;
