import { NextResponse } from "next/server";

let cachedAccessToken: string | null = null;
let tokenExpirationTime: number = 0;

async function getToken() {
  try {
    const tokenNotExpired = cachedAccessToken && Date.now() < tokenExpirationTime;

    if (tokenNotExpired) {
      return cachedAccessToken;
    }

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
    cachedAccessToken = response.access_token;
    tokenExpirationTime = Date.now() + 3600 * 1000;

    return cachedAccessToken;
  } catch (error) {
    console.error(error);
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchKeyword = url.searchParams.get("searchKeyword");
    const searchUrl = `https://api.spotify.com/v1/search?q=${searchKeyword}&type=album&limit=5`;

    const accessToken = await getToken();

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await fetch(searchUrl, {
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Error: albumData fetch failed");
    }

    const result = await response.json();
    const searchData = result.albums.items;

    return NextResponse.json(searchData);
  } catch (error) {
    console.error(error);
  }
}
