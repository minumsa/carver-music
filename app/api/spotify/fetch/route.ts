import { CashedAccessToken, SpotifyAlbumData } from "@/app/modules/types";
import { NextResponse } from "next/server";

let cachedAccessToken: CashedAccessToken = null;
let tokenExpirationTime: number = 0;

export const dynamic = "force-dynamic";

async function getToken() {
  try {
    const isTokenValid = Date.now() < tokenExpirationTime;
    const tokenNotExpired = cachedAccessToken && isTokenValid;

    if (tokenNotExpired) return cachedAccessToken;

    require("dotenv").config();
    const url = "https://accounts.spotify.com/api/token";
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const basicToken = btoa(`${clientId}:${clientSecret}`);
    let headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basicToken}`,
    };
    const result = "grant_type=client_credentials";
    const accessTokenResponse = await fetch(url, {
      method: "POST",
      headers,
      body: result,
      cache: "no-store",
    });

    if (!accessTokenResponse.ok) {
      console.error("Error: Access token fetch failed");
    }

    const response = await accessTokenResponse.json();

    // tokenExpirationTime이 1시간으로 설정되어 있으므로, 1시간 후에 만료
    // 만료 전이면 토큰을 재사용하고, 그렇지 않으면 새로운 토큰을 발급
    cachedAccessToken = response.access_token;
    tokenExpirationTime = Date.now() + 3600 * 1000;

    return cachedAccessToken;
  } catch (error) {
    console.error(error);
  }
}

// FIXME: REST API - URI 이름 리소스 표현에 중점 두고 명사 위주로 변경

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const albumId = url.searchParams.get("albumId");
    const albumUrl = `https://api.spotify.com/v1/albums/${albumId}?market=KR&locale=ko-KR`;

    const accessToken = await getToken();

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await fetch(albumUrl, { headers, cache: "no-store" });

    if (!response.ok) {
      console.error("Error: albumData fetch failed");
    }

    const albumData = await response.json();
    const { artists, tracks, id, name, label, release_date } = albumData;

    const artistId = artists[0].id;
    const artistUrl = `https://api.spotify.com/v1/artists/${artistId}?market=KR&locale=ko-KR`;
    const artistDataResponse = await fetch(artistUrl, { headers });

    if (!artistDataResponse.ok) {
      console.error("Error: artistDataResponse fetch failed");
    }

    const artistData = await artistDataResponse.json();
    const duration = Math.floor(
      tracks.items.map((data: any) => data.duration_ms).reduce((a: number, b: number) => a + b) /
        1000,
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
  }
}
