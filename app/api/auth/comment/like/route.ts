import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
require("dotenv").config();

if (!process.env.MONGODB_COMMENTS_URI) throw new Error("env error");
const uri: string = process.env.MONGODB_COMMENTS_URI;

export async function PUT(request: Request) {
  try {
    const { commentId, userId, likedUserIds } = await request.json();

    const client = await MongoClient.connect(uri);
    const db = client.db();

    const prevComment = await db.collection("comments").findOne({ _id: new ObjectId(commentId) });

    if (!prevComment) {
      return NextResponse.json({ message: "해당 댓글을 찾을 수 없습니다." }, { status: 404 });
    }

    // userId가 일치하지 않으면 권한 오류 응답
    // if (prevComment.userId !== userId) {
    //   return NextResponse.json({ message: "댓글 수정 권한이 없습니다." }, { status: 403 });
    // }

    await db
      .collection("comments")
      .updateOne({ _id: new ObjectId(commentId) }, { $set: { likedUserIds } });

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
