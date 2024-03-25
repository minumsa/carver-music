"use client";

import SearchContent from "@/app/components/search/SearchContent";
import { MusicLayout } from "@/app/components/@common/MusicLayout";
import { PageProps } from "../../modules/types";

export default function Page({ params }: PageProps) {
  const searchInfo = {
    currentKeyword: "",
    currentPage: params.page,
    currentTagName: "",
    totalDataLength: 0,
  };

  return (
    <MusicLayout>
      <SearchContent data={[]} searchInfo={searchInfo} />
    </MusicLayout>
  );
}
