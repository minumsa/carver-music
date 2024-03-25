import Content from "../components/@common/Content";
import { MusicLayout } from "../components/@common/MusicLayout";
import { fetchGenreData } from "../modules/api";
import { FIRST_PAGE } from "../modules/constants";
import { PageProps } from "../modules/types";

export default async function Page({ params }: PageProps) {
  const currentGenre = params.genre;

  try {
    const { genreData, genreDataCount } = await fetchGenreData(currentGenre, FIRST_PAGE);

    return (
      <MusicLayout>
        <Content data={genreData} dataCount={genreDataCount} currentPage={FIRST_PAGE} />
      </MusicLayout>
    );
  } catch (error) {
    console.error(error);
  }
}
