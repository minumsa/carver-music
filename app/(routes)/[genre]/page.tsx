import Error from "../../components/@common/Error";
import GenreContents from "../../components/@common/GenreContents";
import { MusicLayout } from "../../components/@common/MusicLayout";
import { fetchGenreData } from "../../modules/api/album";
import { FIRST_PAGE } from "../../modules/constants";
import { PageProps } from "../../modules/types";

export default async function Page({ params }: PageProps): Promise<React.ReactElement> {
  const currentGenre = params.genre;

  try {
    const { genreData, genreDataCount } = await fetchGenreData(currentGenre, FIRST_PAGE);

    return (
      <MusicLayout>
        <GenreContents data={genreData} dataCount={genreDataCount} currentPage={FIRST_PAGE} />
      </MusicLayout>
    );
  } catch (error) {
    return <Error error={error as Error} />;
  }
}
