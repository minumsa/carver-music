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
    const projection = {
      album: 1,
      artist: 1,
      artistId: 1,
      blurHash: 1,
      duration: 1,
      _id: 0,
      id: 1,
      imgUrl: 1,
      label: 1,
      link: 1,
      markdown: 1,
      releaseDate: 1,
      score: 1,
      tagKeys: 1,
      text: 1,
      title: 1,
      tracks: 1,
      uploadDate: 1,
      videos: 1,
    };

    const postData = await Music.findOne({ id: albumId }).select(projection);

    if (!postData) {
      return NextResponse.json({ message: "데이터를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json(postData);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
