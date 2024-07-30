import Error from "@/app/components/@common/Error";
import { MusicLayout } from "../../../components/@common/MusicLayout";
import { fetchGenreData } from "../../../modules/api/album";
import { PageProps } from "../../../modules/types";
import GenreContents from "@/app/components/@common/GenreContents";

export default async function Page({ params }: PageProps): Promise<React.ReactElement> {
  const activeGenre = params.genre;
  const activePage = params.page;

  try {
    const { genreData, genreDataCount } = await fetchGenreData(activeGenre, activePage);

    return (
      <MusicLayout>
        <GenreContents data={genreData} dataCount={genreDataCount} activePage={activePage} />
      </MusicLayout>
    );
  } catch (error) {
    return <Error error={error as Error} />;
  }
}
