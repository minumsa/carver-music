import connectMongoDB from "@/app/modules/mongodb";
import Music from "@/models/music";
import { NextResponse } from "next/server";
import { SortKey } from "@/app/modules/types";
import { SUB_PER_PAGE_COUNT } from "@/app/modules/config";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    require("dotenv").config();
    await connectMongoDB();

    const url = new URL(request.url);
    const artistId = url.searchParams.get("artistId");
    const activePage = Number(url.searchParams.get("activePage"));
    const skipCount = SUB_PER_PAGE_COUNT * activePage - SUB_PER_PAGE_COUNT;
    const projection = {
      album: 1,
      artist: 1,
      artistId: 1,
      artistImgUrl: 1,
      blurHash: 1,
      duration: 1,
      _id: 0,
      id: 1,
      imgUrl: 1,
      markdown: 1,
      releaseDate: 1,
      score: 1,
      tagKeys: 1,
      text: 1,
      tracks: 1,
    };

    const sortKey: SortKey = { releaseDate: -1 };
    const artistData = await Music.find({ artistId: artistId })
      .sort(sortKey)
      .skip(skipCount)
      .limit(SUB_PER_PAGE_COUNT)
      .select(projection);
    const artistDataCount = await Music.find({ artistId: artistId }).count();

    return NextResponse.json({ artistData, artistDataCount });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
