import { fetchSpotifyAccessToken } from "@/app/modules/api";
import { SpotifyAlbumData } from "@/app/modules/types";
import { NextResponse } from "next/server";

// Spotify API
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const albumId = url.searchParams.get("albumId");
    const albumUrl = `https://api.spotify.com/v1/albums/${albumId}`;

    const { accessToken } = await fetchSpotifyAccessToken();

    if (!accessToken) {
      console.error("Error: Access token is not available");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const albumDataResponse = await fetch(albumUrl, { headers });

    if (!albumDataResponse.ok) {
      console.error("Error: albumData fetch failed");
    }

    const albumData = await albumDataResponse.json();
    const { artists, tracks, id, name, label, release_date } = albumData;

    const artistId = artists[0].id;
    const artistUrl = `https://api.spotify.com/v1/artists/${artistId}`;
    const artistDataResponse = await fetch(artistUrl, { headers });

    if (!artistDataResponse.ok) {
      console.error("Error: artistDataResponse fetch failed");
    }

    const artistData = await artistDataResponse.json();
    const duration = Math.floor(
      tracks.items.map((data: any) => data.duration_ms).reduce((a: number, b: number) => a + b) /
        1000
    );

    const fetchedData: SpotifyAlbumData = {
      id: id,
      artistId: artists[0].id,
      imgUrl: albumData.images[0].url,
      artistImgUrl: artistData.images[0].url,
      artist: artists[0].name,
      album: name,
      label: label,
      releaseDate: release_date,
      tracks: tracks.items.length,
      duration: duration,
    };

    return NextResponse.json(fetchedData);
  } catch (error) {
    console.error(error);
    return null;
  }
}
