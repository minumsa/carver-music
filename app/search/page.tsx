import SearchContent from "@/app/components/search/SearchContent";
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
      <SearchContent data={[]} searchInfo={searchInfo} />
    </MusicLayout>
  );
}
