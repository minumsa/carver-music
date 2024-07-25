"use client";

import { AlbumContents } from "../@common/album/AlbumContents";
import { ContentLayout } from "../@common/ContentLayout";
import { ArtistHeader } from "./ArtistHeader";
import { AlbumData } from "../../modules/types";

interface ArtistContentProps {
  artistData: AlbumData[];
  artistDataCount: number;
  activePage: number;
}

export default function ArtistContents({
  artistData,
  artistDataCount,
  activePage,
}: ArtistContentProps) {
  return (
    <ContentLayout activePage={activePage} dataCount={artistDataCount}>
      <ArtistHeader artistData={artistData} />
      <AlbumContents albumData={artistData} />
    </ContentLayout>
  );
}
