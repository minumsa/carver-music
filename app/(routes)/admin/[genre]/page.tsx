import GenreContents from "@/app/components/@common/GenreContents";
import { MusicLayout } from "../../../components/@common/MusicLayout";
import { fetchGenreData } from "../../../modules/api/album";
import { PageProps } from "../../../modules/types";
import { FIRST_PAGE } from "@/app/modules/config";

export default async function Page({ params }: PageProps) {
  const activeGenre = params.genre;

  try {
    const { genreData, genreDataCount } = await fetchGenreData(activeGenre, FIRST_PAGE);

    return (
      <MusicLayout>
        <GenreContents data={genreData} dataCount={genreDataCount} activePage={FIRST_PAGE} />
      </MusicLayout>
    );
  } catch (error) {
    console.error(error);
  }
}
