import SearchContents from "@/app/components/search/SearchContents";
import { MusicLayout } from "@/app/components/@common/MusicLayout";

export default function Page() {
  const searchInfo = {
    currentKeyword: "",
    currentPage: 0,
    currentTagName: "",
    totalDataLength: 0,
  };

  return (
    <MusicLayout>
      <SearchContents data={[]} searchInfo={searchInfo} />
    </MusicLayout>
  );
}
