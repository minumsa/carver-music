import SearchContents from "@/app/components/search/SearchContents";
import { MusicLayout } from "@/app/components/@common/MusicLayout";
import { PageProps } from "@/app/modules/types";
import { fetchSearchData } from "@/app/modules/api";

export default async function Page({ params }: PageProps) {
  const currentKeyword: string = params.keyword;
  const currentPage: number = params.page;

  try {
    const { searchData, searchDataCount } = await fetchSearchData(currentKeyword, currentPage);
    const searchInfo = {
      currentKeyword,
      currentPage,
      currentTagName: "",
      totalDataLength: searchDataCount,
    };

    return (
      <MusicLayout>
        <SearchContents data={searchData} searchInfo={searchInfo} />
      </MusicLayout>
    );
  } catch (error) {
    console.error(error);
  }
}
