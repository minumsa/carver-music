import Error from "@/app/components/@common/Error";
import { MusicLayout } from "@/app/components/@common/MusicLayout";
import { CalendarNoSSR } from "@/app/components/calendar/Calendar";

export default async function Page() {
  try {
    return (
      <MusicLayout>
        <CalendarNoSSR />
      </MusicLayout>
    );
  } catch (error) {
    return <Error error={error as Error} />;
  }
}
