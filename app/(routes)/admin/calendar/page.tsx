import Error from "@/app/components/@common/Error";
import { MusicLayout } from "@/app/components/@common/MusicLayout";
import { CalendarNoSSR } from "@/app/components/calendar/CaldendarNoSSR";
import { fetchCalendarDataSSR } from "@/app/modules/api/album";
import { getTodaysYearMonth } from "@/app/modules/utils";
import { fetchCache } from "@/app/modules/api/cacheSettings";

export default async function Page() {
  try {
    const { year, month } = getTodaysYearMonth();
    const calendarData = await fetchCalendarDataSSR(year, month);

    return (
      <MusicLayout>
        <CalendarNoSSR initialCalendarData={calendarData} />
      </MusicLayout>
    );
  } catch (error) {
    return <Error error={error as Error} />;
  }
}
