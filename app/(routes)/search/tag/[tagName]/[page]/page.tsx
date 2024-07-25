import SearchContents from "@/app/components/search/SearchContents";
import { MusicLayout } from "@/app/components/@common/MusicLayout";
import { PageProps } from "@/app/modules/types";
import { fetchTagData } from "@/app/modules/api/album";
import Error from "@/app/components/@common/Error";

export default async function Page({ params }: PageProps): Promise<React.ReactElement> {
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
    return <Error error={error as Error} />;
  }
}
