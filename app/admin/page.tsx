import { Grid } from "../components/main/Grid";
import { MusicLayout } from "../components/@common/MusicLayout";
import { fetchInitialAlbumData } from "../modules/api";

export default async function Page() {
  try {
    // const { albumData, totalScrollCount } = await fetchInitialAlbumData();
    // initialData={albumData} totalScrollCount={totalScrollCount}

    return (
      <MusicLayout>
        <Grid />
      </MusicLayout>
    );
  } catch (error) {
    console.error(error);
  }
}
