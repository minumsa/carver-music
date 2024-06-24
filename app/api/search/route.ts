import connectMongoDB from "@/app/modules/mongodb";
import Music from "@/models/music";
import { NextResponse } from "next/server";
import { SUB_PER_PAGE_COUNT } from "../../modules/constants";
import { SortKey } from "@/app/modules/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    require("dotenv").config();
    await connectMongoDB();

    const url = new URL(request.url);
    const currentPage = Number(url.searchParams.get("currentPage"));
    const currentKeyword: any = url.searchParams.get("currentKeyword");

    const sortKey: SortKey = { artist: 1, releaseDate: 1 };

    const skipCount = SUB_PER_PAGE_COUNT * currentPage - SUB_PER_PAGE_COUNT;
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

    const searchData = await Music.find({
      $or: [
        { text: { $regex: new RegExp(currentKeyword, "i") } },
        { artist: { $regex: new RegExp(currentKeyword, "i") } },
        { album: { $regex: new RegExp(currentKeyword, "i") } },
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
