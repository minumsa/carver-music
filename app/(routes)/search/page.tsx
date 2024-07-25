import SearchContents from "@/app/components/search/SearchContents";
import { MusicLayout } from "@/app/components/@common/MusicLayout";

export default function Page() {
  const searchInfo = {
    activeKeyword: "",
    activePage: 0,
    activeTagName: "",
    totalDataLength: 0,
  };

  return (
    <MusicLayout>
      <SearchContents data={[]} searchInfo={searchInfo} />
    </MusicLayout>
  );
}
