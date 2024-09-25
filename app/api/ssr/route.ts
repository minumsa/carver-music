import { PER_PAGE_COUNT } from "@/app/modules/config";
import connectMongoDB from "@/app/modules/mongodb";
import { SortKey } from "@/app/modules/types";
import Music from "@/models/music";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectMongoDB();

    const sortKey: SortKey = { score: -1, artist: 1 };
    const query = {};

    const skipCount = 0;
    const projection = {
      album: 1,
      artist: 1,
      artistId: 1,
      blurHash: 1,
      _id: 0,
      id: 1,
      imgUrl: 1,
    };

    const albumData = await Music.find(query)
      .sort(sortKey)
      .skip(skipCount)
      .limit(PER_PAGE_COUNT)
      .select(projection);

    const albumDataCount = await Music.find(query).count();
    return NextResponse.json({ albumData, albumDataCount });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
