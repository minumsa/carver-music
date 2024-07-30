import ArtistContents from "@/app/components/artist/ArtistContents";
import { MusicLayout } from "@/app/components/@common/MusicLayout";
import { PageProps } from "@/app/modules/types";
import { fetchArtistData } from "@/app/modules/api/album";

export default async function Page({ params }: PageProps) {
  const artistId = params.id;
  const activePage = params.page;

  try {
    const { artistData, artistDataCount } = await fetchArtistData(artistId, activePage);

    return (
      <MusicLayout>
        <ArtistContents
          artistData={artistData}
          artistDataCount={artistDataCount}
          activePage={activePage}
        />
      </MusicLayout>
    );
  } catch (error) {
    console.error(error);
  }
}
