import connectMongoDB from "@/app/modules/mongodb";
import Music from "@/models/music";
import { NextResponse } from "next/server";
import { SUB_PER_PAGE_COUNT } from "../../modules/constants";

export async function GET(request: Request) {
  try {
    require("dotenv").config();
    await connectMongoDB();

    const url = new URL(request.url);
    const currentPage = Number(url.searchParams.get("currentPage"));
    const currentKeyword: any = url.searchParams.get("currentKeyword");

    type SortOrder = 1 | -1;
    const sortKey: { [key: string]: SortOrder } = { artist: 1, releaseDate: 1 };

    let skipCount = SUB_PER_PAGE_COUNT * currentPage - SUB_PER_PAGE_COUNT;
    const searchData = await Music.find({
      $or: [
        { text: { $regex: new RegExp(currentKeyword, "i") } },
        { artist: { $regex: new RegExp(currentKeyword, "i") } },
        { album: { $regex: new RegExp(currentKeyword, "i") } },
      ],
    })
      .sort(sortKey)
      .skip(skipCount)
      .limit(SUB_PER_PAGE_COUNT);

    const searchDataCount = await Music.find({
      $or: [
        { text: { $regex: new RegExp(currentKeyword, "i") } }, // 'i' 옵션은 대소문자를 구별하지 않도록 설정
        { artist: { $regex: new RegExp(currentKeyword, "i") } },
        { album: { $regex: new RegExp(currentKeyword, "i") } },
      ],
    }).count();

    return NextResponse.json({ searchData, searchDataCount });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
