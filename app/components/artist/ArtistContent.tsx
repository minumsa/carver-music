"use client";

import { AlbumContents } from "../@common/album/AlbumContents";
import { ContentLayout } from "../@common/ContentLayout";
import { ArtistPageImage } from "./ArtistPageImage";
import { AlbumInfo } from "../../modules/types";

interface ArtistContentProps {
  artistData: AlbumInfo[];
  artistDataCount: number;
  currentPage: number;
}

export default function ArtistContent({
  artistData,
  artistDataCount,
  currentPage,
}: ArtistContentProps) {
  return (
    <ContentLayout currentPage={currentPage} dataCount={artistDataCount}>
      <ArtistPageImage artistData={artistData} />
      <AlbumContents albumData={artistData} />
    </ContentLayout>
  );
}
