import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const tokenUrl = `https://music.divdivdiv.com/api/spotify`;

    const response = await fetch(tokenUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch spotify access token");
    }

    const { accessToken } = await response.json();

    const url = new URL(request.url);
    const searchKeyword = url.searchParams.get("searchKeyword");

    const searchUrl = `https://api.spotify.com/v1/search?q=${searchKeyword}&type=album`;

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const searchDataResponse = await fetch(searchUrl, { headers });

    if (!searchDataResponse.ok) {
      return new Error("Failed to search spotify data");
    }

    const searchData = await searchDataResponse.json();
    const data = searchData.albums.items.slice(0, 5);

    return NextResponse.json(data);
  } catch (error) {
    return new Error("Internal server error");
  }
}
