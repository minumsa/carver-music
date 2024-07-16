import { MongoClient } from "mongodb";
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
