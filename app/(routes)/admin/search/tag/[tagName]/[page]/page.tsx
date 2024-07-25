import SearchContents from "@/app/components/search/SearchContents";
import { MusicLayout } from "@/app/components/@common/MusicLayout";
import { PageProps } from "@/app/modules/types";
import { fetchTagData } from "@/app/modules/api/album";

export default async function Page({ params }: PageProps) {
  const activeTag: string = params.tagName;
  const activePage: number = params.page;

  try {
    const { tagData, tagDataCount } = await fetchTagData(activeTag, activePage);
    const searchInfo = {
      activeKeyword: "",
      activePage,
      activeTagName: activeTag,
      totalDataLength: tagDataCount,
    };

    return (
      <MusicLayout>
        <SearchContents data={tagData} searchInfo={searchInfo} />
      </MusicLayout>
    );
  } catch (error) {
    console.error(error);
  }
}
