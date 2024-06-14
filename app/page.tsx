import Error from "./components/@common/Error";
import { MusicLayout } from "./components/@common/MusicLayout";
import { LandingPage } from "./components/landingPage/LandingPage";
import { fetchInitialAlbumData } from "./modules/api";

export default async function Page() {
  try {
    const { albumData, totalScrollCount } = await fetchInitialAlbumData();

    return (
      <MusicLayout>
        <LandingPage initialData={albumData} initialTotalScrollCount={totalScrollCount} />
      </MusicLayout>
    );
  } catch (error) {
    return <Error error={error as Error} />;
  }
}
