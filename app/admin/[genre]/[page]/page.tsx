import { MusicLayout } from "@/app/components/@common/MusicLayout";
import Content from "@/app/components/@common/Content";
import { PageProps } from "@/app/modules/types";
import { fetchGenreData } from "@/app/modules/api";

export default async function Page({ params }: PageProps) {
  const currentGenre = params.genre;
  const currentPage = params.page;

  try {
    const { genreData, genreDataCount } = await fetchGenreData(currentGenre, currentPage);

    return (
      <MusicLayout>
        <Content data={genreData} dataCount={genreDataCount} currentPage={currentPage} />
      </MusicLayout>
    );
  } catch (error) {
    console.error(error);
  }
}
