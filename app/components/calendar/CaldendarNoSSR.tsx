import dynamic from "next/dynamic";

// react-calendar 패키지 렌더링 관련 이슈로 컴포넌트 NoSSR 처리
export const CalendarNoSSR = dynamic(() => import("@/app/components/calendar/Calendar"), {
  ssr: false,
});
