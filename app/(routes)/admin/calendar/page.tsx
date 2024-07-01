import Error from "@/app/components/@common/Error";
import { MusicLayout } from "@/app/components/@common/MusicLayout";
import { CalendarNoSSR } from "@/app/components/calendar/CaldendarNoSSR";
import { fetchCalendarDataSSR } from "@/app/modules/api";
import { getTodaysYearMonth } from "@/app/modules/utils";

export default async function Page() {
  try {
    const { year, month } = getTodaysYearMonth();
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
