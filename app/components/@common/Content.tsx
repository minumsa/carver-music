"use client";

import { AlbumInfo } from "../../modules/types";
import { AlbumContents } from "./album/AlbumContents";
import { ContentLayout } from "./ContentLayout";

interface ContentProps {
  data: AlbumInfo[];
  dataCount: number;
  currentPage: number;
}

export default function Content({ data, dataCount, currentPage }: ContentProps) {
  return (
    <ContentLayout currentPage={currentPage} dataCount={dataCount}>
      <AlbumContents albumData={data} />
    </ContentLayout>
  );
}
