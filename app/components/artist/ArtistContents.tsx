"use client";

import { AlbumContents } from "../@common/album/AlbumContents";
import { ContentLayout } from "../@common/ContentLayout";
import { ArtistHeader } from "./ArtistHeader";
import { AlbumInfo } from "../../modules/types";

interface ArtistContentProps {
  artistData: AlbumInfo[];
  artistDataCount: number;
  currentPage: number;
}

export default function ArtistContents({
  artistData,
  artistDataCount,
  currentPage,
}: ArtistContentProps) {
  return (
    <ContentLayout currentPage={currentPage} dataCount={artistDataCount}>
      <ArtistHeader artistData={artistData} />
      <AlbumContents albumData={artistData} />
    </ContentLayout>
  );
}
