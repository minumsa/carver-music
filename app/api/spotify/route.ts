import { NextResponse } from "next/server";

export async function GET() {
  try {
    require("dotenv").config();
    const url = "https://accounts.spotify.com/api/token";
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const basicToken = btoa(`${clientId}:${clientSecret}`);
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basicToken}`,
    };
    const data = "grant_type=client_credentials";
    const accessTokenResponse = await fetch(url, {
      method: "POST",
      headers,
      body: data,
    });

    if (!accessTokenResponse.ok) {
      console.error("Error: Access token fetch failed");
    }

    const result = await accessTokenResponse.json();
    const accessToken = NextResponse.json(result.access_token);
    return accessToken;
  } catch (error) {
    console.error(error);
    return null;
  }
}
