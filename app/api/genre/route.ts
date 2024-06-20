import connectMongoDB from "@/app/modules/mongodb";
import Music from "@/models/music";
import { NextResponse } from "next/server";
import { SUB_PER_PAGE_COUNT } from "../../modules/constants";
import { Genres, SortKey } from "@/app/modules/types";

interface Query {
  genre: Genres[keyof Genres]; // Genres 인터페이스의 키 값들 중 하나
}

export async function GET(request: Request) {
  try {
    await connectMongoDB();

    const url = new URL(request.url);
    const currentPage = Number(url.searchParams.get("currentPage"));
    const currentGenre = url.searchParams.get("currentGenre");

    const sortKey: SortKey = { score: -1, artist: 1 };
    const query: Query = { genre: currentGenre as Genres[keyof Genres] };

    const skipCount = SUB_PER_PAGE_COUNT * currentPage - SUB_PER_PAGE_COUNT;
    const genreData = await Music.find(query)
      .sort(sortKey)
      .skip(skipCount)
      .limit(SUB_PER_PAGE_COUNT);
    const genreDataCount = await Music.find(query).count();
    return NextResponse.json({ genreData, genreDataCount });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
