import { LandingPage } from "../../components/landingPage/LandingPage";
import { MusicLayout } from "../../components/@common/MusicLayout";
import { PER_PAGE_COUNT } from "@/app/modules/constants";
import { fetchAlbumDataSSR } from "@/app/modules/api";

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
    console.error(error);
  }
}
