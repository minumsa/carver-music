"use client";

import { AlbumData } from "../../modules/types";
import { AlbumContents } from "./album/AlbumContents";
import { ContentLayout } from "./ContentLayout";

interface ContentProps {
  data: AlbumData[];
  dataCount: number;
  activePage: number;
}

export default function GenreContents({ data, dataCount, activePage }: ContentProps) {
  return (
    <ContentLayout activePage={activePage} dataCount={dataCount}>
      <AlbumContents albumData={data} />
    </ContentLayout>
  );
}
