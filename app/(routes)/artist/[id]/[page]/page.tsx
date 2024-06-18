import Error from "@/app/components/@common/Error";
import ArtistContents from "../../../../components/artist/ArtistContents";
import { MusicLayout } from "@/app/components/@common/MusicLayout";
import { fetchArtistData } from "@/app/modules/api";
import { SITE_TITLE } from "@/app/modules/constants";
import { PageProps } from "@/app/modules/types";
import React from "react";
import { Metadata } from "next";

export default async function Page({ params }: PageProps): Promise<React.ReactElement> {
  const artistId = params.id;
  const currentPage = params.page;

  try {
    const { artistData, artistDataCount } = await fetchArtistData(artistId, currentPage);

    return (
      <MusicLayout>
        <ArtistContents
          artistData={artistData}
          artistDataCount={artistDataCount}
          currentPage={currentPage}
        />
      </MusicLayout>
    );
  } catch (error) {
    return <Error error={error as Error} />;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const artistId = params.id;
  const currentPage = params.page;

  const { artistData } = await fetchArtistData(artistId, currentPage);
  const firstArtistData = artistData[0];

  if (!firstArtistData) {
    console.error("No artist data found");
  }

  const { artistImgUrl, artist, text } = firstArtistData;
  const title = artist;
  const currentUrl = `https://music.divdivdiv.com/artist/${artistId}/1`;
  const textPreview = text.length > 30 ? text.substring(0, 30) + "..." : text;

  return {
    title: title,
    description: textPreview,
    openGraph: {
      title: title,
      images: [artistImgUrl],
      url: currentUrl,
      type: "website",
      siteName: SITE_TITLE,
      description: textPreview,
    },
  };
}
