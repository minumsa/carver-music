import SearchContent from "@/app/components/search/SearchContent";
import { MusicLayout } from "@/app/components/@common/MusicLayout";
import { PageProps } from "@/app/modules/types";
import { fetchTagData } from "@/app/modules/api";

export default async function Page({ params }: PageProps) {
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
    console.error(error);
  }
}
