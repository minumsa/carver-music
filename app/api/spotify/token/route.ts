import { NextResponse } from "next/server";

export async function GET() {
  try {
    const url = `/api/spotify`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch spotify access token");
    }

    const accessToken = await response.json();

    if (!accessToken) {
      throw new Error("Failed to retrieve access token from response data");
    }

    return NextResponse.json(accessToken);
  } catch (error) {
    throw new Error("Failed to fetch spotify access token");
  }
}
