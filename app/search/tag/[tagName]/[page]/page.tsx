import SearchContent from "@/app/components/search/SearchContent";
import { MusicLayout } from "@/app/components/@common/MusicLayout";
import { PageProps } from "@/app/modules/types";
import { fetchTagData } from "@/app/modules/api";
import Error from "@/app/components/@common/Error";

export default async function Page({ params }: PageProps): Promise<React.ReactElement> {
  const currentTag: string = params.tagName;
  const currentPage: number = params.page;

  try {
    const { tagData, tagDataCount } = await fetchTagData(currentTag, currentPage);
    const searchInfo = {
      currentKeyword: "",
      currentPage,
      currentTagName: currentTag,
      totalDataLength: tagDataCount,
    };

    return (
      <MusicLayout>
        <SearchContent data={tagData} searchInfo={searchInfo} />
      </MusicLayout>
    );
  } catch (error) {
    return <Error error={error as Error} />;
  }
}
