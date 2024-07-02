import Error from "@/app/components/@common/Error";
import { MusicLayout } from "@/app/components/@common/MusicLayout";
import { CalendarDetail } from "@/app/components/calendar/CalendarDetail";
import { fetchCalendarDataSSR } from "@/app/modules/api";
import { PageProps } from "@/app/modules/types";
import { getYearMonthFromStr } from "@/app/modules/utils";

export default async function Page({ params }: PageProps) {
  try {
    const { year, month, day } = getYearMonthFromStr(params.date);
    const calendarData = await fetchCalendarDataSSR(year, month);

    return (
      <MusicLayout>
        <CalendarDetail calendarData={calendarData} day={day} />
      </MusicLayout>
    );
  } catch (error) {
    return <Error error={error as Error} />;
  }
}
