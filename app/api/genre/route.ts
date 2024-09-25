import connectMongoDB from "@/app/modules/mongodb";
import Music from "@/models/music";
import { NextResponse } from "next/server";
import { Genres, SortKey } from "@/app/modules/types";
import { SUB_PER_PAGE_COUNT } from "@/app/modules/config";

interface Query {
  genre: Genres[keyof Genres]; // Genres 인터페이스의 키 값들 중 하나
}

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await connectMongoDB();

    const url = new URL(request.url);
    const activePage = Number(url.searchParams.get("activePage"));
    const activeGenre = url.searchParams.get("activeGenre");

    const sortKey: SortKey = { score: -1, artist: 1 };
    const query: Query = { genre: activeGenre as Genres[keyof Genres] };

    const skipCount = SUB_PER_PAGE_COUNT * activePage - SUB_PER_PAGE_COUNT;
    const projection = {
      _id: 0,
      album: 1,
      artist: 1,
      artistId: 1,
      artistImgUrl: 1,
      blurHash: 1,
      duration: 1,
      id: 1,
      imgUrl: 1,
      markdown: 1,
      releaseDate: 1,
      score: 1,
      tagKeys: 1,
      text: 1,
      tracks: 1,
    };
    const genreData = await Music.find(query)
      .sort(sortKey)
      .skip(skipCount)
      .limit(SUB_PER_PAGE_COUNT)
      .select(projection);

    const genreDataCount = await Music.find(query).count();
    return NextResponse.json({ genreData, genreDataCount });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
