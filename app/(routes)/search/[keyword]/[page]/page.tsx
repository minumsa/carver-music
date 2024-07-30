import SearchContents from "@/app/components/search/SearchContents";
import { MusicLayout } from "@/app/components/@common/MusicLayout";
import { PageProps } from "@/app/modules/types";
import { fetchSearchData } from "@/app/modules/api/album";
import Error from "@/app/components/@common/Error";

export default async function Page({ params }: PageProps): Promise<React.ReactElement> {
  const activeKeyword: string = params.keyword;
  const activePage: number = params.page;

  try {
    const { searchData, searchDataCount } = await fetchSearchData(activeKeyword, activePage);
    const searchInfo = {
      activeKeyword,
      activePage,
      activeTagName: "",
      totalDataLength: searchDataCount,
    };

    return (
      <MusicLayout>
        <SearchContents data={searchData} searchInfo={searchInfo} />
      </MusicLayout>
    );
  } catch (error) {
    return <Error error={error as Error} />;
  }
}
