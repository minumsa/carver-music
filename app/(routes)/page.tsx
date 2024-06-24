import Error from "../components/@common/Error";
import { MusicLayout } from "../components/@common/MusicLayout";
import { LandingPage } from "../components/landingPage/LandingPage";
import { fetchAlbumDataSSR } from "../modules/api";
import { PER_PAGE_COUNT } from "../modules/constants";

export default async function Page() {
  try {
    const { albumData, albumDataCount } = await fetchAlbumDataSSR();
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
