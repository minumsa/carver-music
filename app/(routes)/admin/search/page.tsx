"use client";

import SearchContents from "@/app/components/search/SearchContents";
import { MusicLayout } from "@/app/components/@common/MusicLayout";
import { PageProps } from "../../../modules/types";

export default function Page({ params }: PageProps) {
  const searchInfo = {
    activeKeyword: "",
    activePage: params.page,
    activeTagName: "",
    totalDataLength: 0,
  };

  return (
    <MusicLayout>
      <SearchContents data={[]} searchInfo={searchInfo} />
    </MusicLayout>
  );
}
