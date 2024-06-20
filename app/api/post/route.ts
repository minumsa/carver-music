import connectMongoDB from "@/app/modules/mongodb";
import Music from "@/models/music";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    require("dotenv").config();
    await connectMongoDB();

    const url = new URL(request.url);
    const albumId = url.searchParams.get("albumId");

    const postData = await Music.findOne({ id: albumId });

    if (!postData) {
      return NextResponse.json({ message: "데이터를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json(postData);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
