import dynamic from "next/dynamic";

export const CalendarNoSSR = dynamic(() => import("@/app/components/calendar/Calendar"), {
  ssr: false,
});
