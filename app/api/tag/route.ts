import connectMongoDB from "@/app/modules/mongodb";
import Music from "@/models/music";
import { NextResponse } from "next/server";
import { SUB_PER_PAGE_COUNT } from "../../modules/constants";
import { SortKey } from "@/app/modules/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await connectMongoDB();

    const url = new URL(request.url);
    const currentPage = Number(url.searchParams.get("currentPage"));
    const currentTag = url.searchParams.get("currentTag");

    const sortKey: SortKey = { score: -1, artist: 1 };
    const query = { tagKeys: currentTag as string };
    const skipCount = SUB_PER_PAGE_COUNT * currentPage - SUB_PER_PAGE_COUNT;
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

    const tagData = await Music.find(query)
      .sort(sortKey)
      .skip(skipCount)
      .limit(SUB_PER_PAGE_COUNT)
      .select(projection);
    const tagDataCount = await Music.find(query).count();

    return NextResponse.json({ tagData, tagDataCount });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
