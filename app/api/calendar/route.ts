import connectMongoDB from "@/app/modules/mongodb";
import { NextResponse } from "next/server";
import Music from "@/models/music";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await connectMongoDB();

    const url = new URL(request.url);
    const year = Number(url.searchParams.get("year"));
    const month = Number(url.searchParams.get("month"));

    const pipeline = [
      {
        // 문자열에서 연도와 월을 추출하여 새로운 필드를 추가
        $addFields: {
          year: { $substr: ["$uploadDate", 0, 4] },
          month: { $substr: ["$uploadDate", 5, 2] },
        },
      },
      {
        // 연도와 월이 일치하는 문서만 필터링
        $match: {
          year: year.toString(),
          month: month.toString().padStart(2, "0"),
        },
      },
      {
        // 필요한 필드만 포함
        $project: {
          _id: 0,
          album: 1,
          artist: 1,
          id: 1,
          imgUrl: 1,
          uploadDate: 1,
        },
      },
    ];

    const calendarData = await Music.aggregate(pipeline);
    return NextResponse.json(calendarData);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
