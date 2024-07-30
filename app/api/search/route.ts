import connectMongoDB from "@/app/modules/mongodb";
import Music from "@/models/music";
import { NextResponse } from "next/server";
import { SortKey } from "@/app/modules/types";
import { SUB_PER_PAGE_COUNT } from "@/app/modules/config";

export const dynamic = "force-dynamic";

require("dotenv").config();

export async function GET(request: Request) {
  try {
    await connectMongoDB();

    const url = new URL(request.url);
    const activePage = Number(url.searchParams.get("activePage"));
    const activeKeyword = url.searchParams.get("activeKeyword") ?? "";

    const sortKey: SortKey = { artist: 1, releaseDate: 1 };

    const skipCount = SUB_PER_PAGE_COUNT * activePage - SUB_PER_PAGE_COUNT;
    const projection = {
      _id: 0,
      album: 1,
      artist: 1,
      artistId: 1,
      artistImgUrl: 1,
      blurHash: 1,
      duration: 1,
      genre: 1,
      id: 1,
      imgUrl: 1,
      markdown: 1,
      releaseDate: 1,
      score: 1,
      tagKeys: 1,
      text: 1,
      tracks: 1,
    };

    const searchData = await Music.find({
      $or: [
        { text: { $regex: new RegExp(activeKeyword, "i") } },
        { artist: { $regex: new RegExp(activeKeyword, "i") } },
        { album: { $regex: new RegExp(activeKeyword, "i") } },
        { id: { $regex: new RegExp(activeKeyword, "i") } },
      ],
    })
      .sort(sortKey)
      .skip(skipCount)
      .limit(SUB_PER_PAGE_COUNT)
      .select(projection);

    const searchDataCount = searchData.length;

    return NextResponse.json({ searchData, searchDataCount });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
