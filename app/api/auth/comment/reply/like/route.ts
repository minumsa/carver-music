import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
require("dotenv").config();

if (!process.env.MONGODB_COMMENTS_URI) throw new Error("env error");
const uri: string = process.env.MONGODB_COMMENTS_URI;

export async function PUT(request: Request) {
  try {
    const { replyId, userId, likedUserIds } = await request.json();

    const client = await MongoClient.connect(uri);
    const db = client.db();

    const prevComment = await db.collection("replies").findOne({ _id: new ObjectId(replyId) });

    if (!prevComment) {
      return NextResponse.json(
        { ok: false, message: "해당 댓글을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // FIXME: 로그인 상태가 아닐 때 쿠키 이용하는 방식으로 코드 변경
    if (!userId) {
      return NextResponse.json({ message: "로그인 상태가 아닙니다." }, { status: 401 });
    }

    await db
      .collection("replies")
      .updateOne({ _id: new ObjectId(replyId) }, { $set: { likedUserIds } });

    client.close();

    const response = NextResponse.json(
      { message: "좋아요 피드백이 반영되었습니다." },
      { status: 200 },
    );
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
