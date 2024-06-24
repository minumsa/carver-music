import { LandingPage } from "../../components/landingPage/LandingPage";
import { MusicLayout } from "../../components/@common/MusicLayout";
import { fetchAlbumData } from "../../modules/api";
import { AlbumFilters } from "@/app/modules/types";
import { PER_PAGE_COUNT } from "@/app/modules/constants";

export default async function Page() {
  try {
    const albumFilters: AlbumFilters = {
      scrollCount: 1,
      currentTag: "",
    };

    // const { albumData, albumDataCount } = await fetchAlbumData(albumFilters);
    // const totalScrollCount = Math.ceil(albumDataCount / PER_PAGE_COUNT);

    return (
      <MusicLayout>
        {/* <LandingPage initialData={albumData} initialTotalScrollCount={totalScrollCount} /> */}
      </MusicLayout>
    );
  } catch (error) {
    console.error(error);
  }
}
