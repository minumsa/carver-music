import { Grid } from "../components/main/Grid";
import { MusicLayout } from "../components/@common/MusicLayout";
import { fetchInitialAlbumData } from "../modules/api";

export default async function Page() {
  try {
    const { albumData, totalScrollCount } = await fetchInitialAlbumData();

    return (
      <MusicLayout>
        <Grid initialData={albumData} totalScrollCount={totalScrollCount} />
      </MusicLayout>
    );
  } catch (error) {
    console.error(error);
  }
}
