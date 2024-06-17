"use client";

import SearchContents from "@/app/components/search/SearchContents";
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
      <SearchContents data={[]} searchInfo={searchInfo} />
    </MusicLayout>
  );
}
