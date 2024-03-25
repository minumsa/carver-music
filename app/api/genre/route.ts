import connectMongoDB from "@/app/modules/mongodb";
import Music from "@/models/music";
import { NextResponse } from "next/server";
import { SortOrder } from "mongoose";
import { SUB_PER_PAGE_COUNT } from "../../modules/constants";

export async function GET(request: Request) {
  try {
    await connectMongoDB();

    const url = new URL(request.url);
    const currentPage = Number(url.searchParams.get("currentPage"));
    const currentGenre = url.searchParams.get("currentGenre") ?? "";

    interface SortKey {
      [key: string]: SortOrder;
    }

    const sortKey: SortKey = { score: -1, artist: 1 };

    interface Query {
      genre: string;
    }

    let query: Query = { genre: currentGenre };

    const skipCount = SUB_PER_PAGE_COUNT * currentPage - SUB_PER_PAGE_COUNT;
    const genreData =
      currentPage === 1
        ? await Music.find(query).sort(sortKey).limit(SUB_PER_PAGE_COUNT)
        : await Music.find(query).sort(sortKey).skip(skipCount).limit(SUB_PER_PAGE_COUNT);
    const genreDataCount = await Music.find(query).count();

    return NextResponse.json({ genreData, genreDataCount });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
