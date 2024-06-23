import Error from "../components/@common/Error";
import { MusicLayout } from "../components/@common/MusicLayout";
import { LandingPage } from "../components/landingPage/LandingPage";
import { fetchAlbumData, fetchInitialAlbumData } from "../modules/api";
import { AlbumFilters } from "../modules/types";

export default async function Page() {
  try {
    const albumFilters: AlbumFilters = {
      scrollCount: 1,
      currentTag: "",
    };

    // const { albumData, albumDataCount } = await fetchAlbumData(albumFilters);

    return (
      <MusicLayout>
        <div>hi</div>
        {/* <LandingPage initialData={albumData} initialTotalScrollCount={albumDataCount} /> */}
      </MusicLayout>
    );
  } catch (error) {
    return <Error error={error as Error} />;
  }
}
