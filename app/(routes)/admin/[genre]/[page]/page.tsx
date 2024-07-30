import { MusicLayout } from "@/app/components/@common/MusicLayout";
import { PageProps } from "@/app/modules/types";
import { fetchGenreData } from "@/app/modules/api/album";
import GenreContents from "@/app/components/@common/GenreContents";

export default async function Page({ params }: PageProps) {
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
    console.error(error);
  }
}
