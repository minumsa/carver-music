import Error from "@/app/components/@common/Error";
import { MusicLayout } from "@/app/components/@common/MusicLayout";
import { CalendarNoSSR } from "@/app/components/calendar/Calendar";
import { fetchCalendarDataSSR } from "@/app/modules/api";
import { getYearMonth } from "@/app/modules/utils";

export default async function Page() {
  try {
    const { year, month } = getYearMonth();
    const calendarData = await fetchCalendarDataSSR(year, month);

    return (
      <MusicLayout>
        <CalendarNoSSR calendarData={calendarData} />
      </MusicLayout>
    );
  } catch (error) {
    return <Error error={error as Error} />;
  }
}
