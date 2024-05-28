import SearchContent from "@/app/components/search/SearchContent";
import { MusicLayout } from "@/app/components/@common/MusicLayout";
import { PageProps } from "@/app/modules/types";
import { fetchSearchData } from "@/app/modules/api";
import Error from "@/app/components/@common/Error";

export default async function Page({ params }: PageProps): Promise<React.ReactElement> {
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
        <SearchContent data={searchData} searchInfo={searchInfo} />
      </MusicLayout>
    );
  } catch (error) {
    return <Error error={error as Error} />;
  }
}
