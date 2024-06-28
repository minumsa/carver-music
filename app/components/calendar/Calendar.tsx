"use client";

import React, { useState } from "react";
import Calendar from "react-calendar";
import styles from "./Calendar.module.css";
import dynamic from "next/dynamic";
// import "react-calendar/dist/Calendar.css";

export const CalendarNoSSR = dynamic(() => import("@/app/components/calendar/Calendar"), {
  ssr: false,
});

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
  const [date, setDate] = useState<any>(new Date());
  const sampleImgUrl = "https://i.scdn.co/image/ab67616d0000b2731cf5a7074796f4cc5b1fa6fa";
  const events = [
    { date: new Date(2024, 5, 1), imgUrl: sampleImgUrl },
    { date: new Date(2024, 5, 5), imgUrl: sampleImgUrl },
  ];

  const test = calendarData.map((data: any) => {
    return {
      date: new Date(data.uploadDate),
      imgUrl: data.imgUrl,
    };
  });

  console.log(test);

  const handleDateChange = (date: any) => {
    setDate(date);
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const event = test.find((event: any) => event.date.toDateString() === date.toDateString());
      return event ? (
        <div className={styles.event}>
          <img src={event.imgUrl} alt="Event" />
        </div>
      ) : null;
    }
    return null;
  };
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      return styles.tile;
    }
    return "";
  };

  return (
    <div className={styles.container}>
      <Calendar
        onChange={handleDateChange}
        value={date}
        tileContent={tileContent}
        tileClassName={tileClassName}
      />
    </div>
  );
};

export default CalendarComponent;
