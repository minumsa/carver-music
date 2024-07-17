import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
require("dotenv").config();

if (!process.env.MONGODB_COMMENTS_URI) throw new Error("env error");
const uri: string = process.env.MONGODB_COMMENTS_URI;

export async function POST(request: Request) {
  try {
    const { commentId, commentUserId, userId, userName, userComment, albumId, date } =
      await request.json();

    // MongoDB 연결하기
    const client = await MongoClient.connect(uri);
    const db = client.db();

    // comments 컬렉션에 복합 인덱스 추가 (이미 존재하는 경우 오류 무시)
    await db.collection("comments").createIndex({ albumId: 1, date: -1 });

    const status = await db.collection("replies").insertOne({
      commentId,
      commentUserId,
      userId,
      userName,
      userComment,
      albumId,
      date,
      likedUserIds: [],
    });

    const response = NextResponse.json({ message: "로그인 성공" }, { status: 200 });
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { replyId, userId } = await request.json();

    const client = await MongoClient.connect(uri);
    const db = client.db();

    const prevComment = await db.collection("replies").findOne({ _id: new ObjectId(replyId) });

    if (!prevComment) {
      return NextResponse.json({ message: "해당 답글을 찾을 수 없습니다." }, { status: 404 });
    }

    if (prevComment.userId !== userId) {
      return NextResponse.json({ message: "답글 삭제 권한이 없습니다." }, { status: 403 });
    }

    await db.collection("replies").deleteOne({ _id: new ObjectId(replyId) });

    return NextResponse.json({ message: "답글이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
