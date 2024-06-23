import Error from "../components/@common/Error";
import { MusicLayout } from "../components/@common/MusicLayout";
import { LandingPage } from "../components/landingPage/LandingPage";
import { fetchAlbumData, fetchGenreData, fetchInitialAlbumData } from "../modules/api";
import { FIRST_PAGE } from "../modules/constants";
import { AlbumFilters } from "../modules/types";

export default async function Page() {
  try {
    const albumFilters: AlbumFilters = {
      scrollCount: 2,
      currentTag: "",
    };

    // const { albumData, albumDataCount } = await fetchAlbumData(albumFilters);
    const { genreData, genreDataCount } = await fetchGenreData("pop", FIRST_PAGE);

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
