import { NextResponse } from "next/server";

export async function getToken() {
  try {
    require("dotenv").config();
    const url = "https://accounts.spotify.com/api/token";
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const basicToken = btoa(`${clientId}:${clientSecret}`);
    let headers: any = {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basicToken}`,
    };
    const result = "grant_type=client_credentials";
    const accessTokenResponse = await fetch(url, {
      method: "POST",
      headers,
      body: result,
    });

    if (!accessTokenResponse.ok) {
      console.error("Error: Access token fetch failed");
    }

    const response = await accessTokenResponse.json();
    const accessToken = response.access_token;
    return accessToken;
  } catch (error) {
    console.error(error);
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchKeyword: string = url.searchParams.get("searchKeyword") ?? "";
    const searchUrl = `https://api.spotify.com/v1/search?q=${searchKeyword}&type=album`;

    const accessToken = await getToken();

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await fetch(searchUrl, {
      headers,
    });

    if (!response.ok) {
      console.error("Error: albumData fetch failed");
    }

    const searchData = await response.json();
    const data = searchData.albums.items.slice(0, 5);

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
  }
}
