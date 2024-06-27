import connectMongoDB from "@/app/modules/mongodb";
import Music from "@/models/music";
import { NextResponse } from "next/server";

require("dotenv").config();

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectMongoDB();

    const randomDocument = await Music.aggregate([{ $sample: { size: 1 } }]);

    if (!randomDocument || randomDocument.length === 0) {
      return NextResponse.json({ message: "랜덤 데이터를 찾을 수 없습니다." }, { status: 404 });
    }

    const randomId = randomDocument[0].id;

    return NextResponse.json(randomId);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
