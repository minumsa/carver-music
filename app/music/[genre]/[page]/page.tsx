import Content from "../../components/@common/Content";
import { MusicLayout } from "../../components/@common/MusicLayout";
import { PageProps } from "../../modules/types";

export default async function Page({ params }: PageProps) {
  const currentGenre = params.genre;
  const currentPage = params.page;

  try {
    const currentTagKey = "";

    const queryString = `?pathName=${currentGenre}&currentPage=${currentPage}&currentTagKey=${currentTagKey}`;
    const url = `https://divdivdiv.com/music/api${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "force-cache",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch music data");
    }

    const { slicedData, totalDataLength } = await response.json();

    return (
      <MusicLayout>
        <Content data={slicedData} totalDataLength={totalDataLength} currentPage={currentPage} />
      </MusicLayout>
    );
  } catch (error) {
    console.error(error);
  }
}
