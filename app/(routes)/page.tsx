import Error from "../components/@common/Error";
import { MusicLayout } from "../components/@common/MusicLayout";
import { LandingPage } from "../components/landingPage/LandingPage";
import { fetchAlbumDataSSR } from "../modules/api";
import { PER_PAGE_COUNT } from "../modules/constants";
import { AlbumFilters } from "../modules/types";

export default async function Page() {
  try {
    const albumFilters: AlbumFilters = {
      scrollCount: 1,
      currentTag: "",
    };

    const { albumData, albumDataCount } = await fetchAlbumDataSSR(albumFilters);
    const totalScrollCount = Math.ceil(albumDataCount / PER_PAGE_COUNT);

    return (
      <MusicLayout>
        <LandingPage initialData={albumData} initialTotalScrollCount={totalScrollCount} />
      </MusicLayout>
    );
  } catch (error) {
    return <Error error={error as Error} />;
  }
}
