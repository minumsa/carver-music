import { LandingPage } from "../../components/landingPage/LandingPage";
import { MusicLayout } from "../../components/@common/MusicLayout";
import { fetchAlbumData, fetchGenreData, fetchInitialAlbumData } from "../../modules/api";
import { AlbumFilters } from "@/app/modules/types";
import { FIRST_PAGE } from "@/app/modules/constants";

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
        {/* <LandingPage initialData={albumData} initialTotalScrollCount={totalScrollCount} /> */}
      </MusicLayout>
    );
  } catch (error) {
    console.error(error);
  }
}
