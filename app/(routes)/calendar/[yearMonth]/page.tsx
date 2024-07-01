import Error from "@/app/components/@common/Error";
import { MusicLayout } from "@/app/components/@common/MusicLayout";
import { CalendarMonth } from "@/app/components/calendar/CalendarMonth";
import { fetchCalendarDataSSR } from "@/app/modules/api";
import { PageProps } from "@/app/modules/types";
import { getYearMonthFromStr } from "@/app/modules/utils";

export default async function Page({ params }: PageProps) {
  try {
    const { year, month } = getYearMonthFromStr(params.yearMonth);
    const calendarData = await fetchCalendarDataSSR(year, month);

    return (
      <MusicLayout>
        <CalendarMonth calendarData={calendarData} />
      </MusicLayout>
    );
  } catch (error) {
    return <Error error={error as Error} />;
  }
}
