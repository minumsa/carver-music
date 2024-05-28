import SearchContent from "@/app/components/search/SearchContent";
import { MusicLayout } from "@/app/components/@common/MusicLayout";
import { PageProps } from "../modules/types";
import Error from "../components/@common/Error";

export default async function Page({ params }: PageProps): Promise<React.ReactElement> {
  const searchInfo = {
    currentKeyword: "",
    currentPage: params.page,
    currentTagName: "",
    totalDataLength: 0,
  };

  try {
    return (
      <MusicLayout>
        <SearchContent data={[]} searchInfo={searchInfo} />
      </MusicLayout>
    );
  } catch (error) {
    return <Error error={error as Error} />;
  }
}
