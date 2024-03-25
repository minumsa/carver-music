import connectMongoDB from "@/app/modules/mongodb";
import Music from "@/models/music";
import { NextResponse } from "next/server";
import { SUB_PER_PAGE_COUNT } from "../../modules/constants";

export async function GET(request: Request) {
  try {
    require("dotenv").config();
    await connectMongoDB();

    const url = new URL(request.url);
    const artistId = url.searchParams.get("artistId");
    const currentPage = Number(url.searchParams.get("currentPage"));
    const skipCount = SUB_PER_PAGE_COUNT * currentPage - SUB_PER_PAGE_COUNT;

    type ReleaseDate = 1 | -1;
    const sortKey: { [key: string]: ReleaseDate } = { releaseDate: -1 };

    const artistData = await Music.find({ artistId: artistId })
      .sort(sortKey)
      .skip(skipCount)
      .limit(SUB_PER_PAGE_COUNT);
    const artistDataCount = await Music.find({ artistId: artistId }).count();

    return NextResponse.json({ artistData, artistDataCount });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
