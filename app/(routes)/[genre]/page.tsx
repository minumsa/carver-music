import { FIRST_PAGE } from "@/app/modules/config";
import Error from "../../components/@common/Error";
import GenreContents from "../../components/@common/GenreContents";
import { MusicLayout } from "../../components/@common/MusicLayout";
import { fetchGenreData } from "../../modules/api/album";
import { PageProps } from "../../modules/types";

export default async function Page({ params }: PageProps): Promise<React.ReactElement> {
  const activeGenre = params.genre;

  try {
    const { genreData, genreDataCount } = await fetchGenreData(activeGenre, FIRST_PAGE);

    return (
      <MusicLayout>
        <GenreContents data={genreData} dataCount={genreDataCount} activePage={FIRST_PAGE} />
      </MusicLayout>
    );
  } catch (error) {
    return <Error error={error as Error} />;
  }
}
