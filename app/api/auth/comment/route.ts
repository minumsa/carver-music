import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
require("dotenv").config();

if (!process.env.MONGODB_COMMENTS_URI) throw new Error("env error");
const uri: string = process.env.MONGODB_COMMENTS_URI;

export async function POST(request: Request) {
  try {
    const { userId, userName, userComment, albumId, date } = await request.json();

    // MongoDB 연결하기
    const client = await MongoClient.connect(uri);
    const db = client.db();

    // comments 컬렉션에 복합 인덱스 추가 (이미 존재하는 경우 오류 무시)
    await db.collection("comments").createIndex({ albumId: 1, date: -1 });

    const status = await db.collection("comments").insertOne({
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

export async function PUT(request: Request) {
  try {
    const { commentId, userId, userComment, date } = await request.json();

    // MongoDB 연결하기
    const client = await MongoClient.connect(uri);
    const db = client.db();

    // 댓글 찾기
    const prevComment = await db.collection("comments").findOne({ _id: new ObjectId(commentId) });

    // 댓글이 없으면 404 응답
    if (!prevComment) {
      return NextResponse.json({ message: "해당 댓글을 찾을 수 없습니다." }, { status: 404 });
    }

    // userId가 일치하지 않으면 권한 오류 응답
    if (prevComment.userId !== userId) {
      return NextResponse.json({ message: "댓글 수정 권한이 없습니다." }, { status: 403 });
    }

    // 댓글 업데이트
    await db
      .collection("comments")
      .updateOne({ _id: new ObjectId(commentId) }, { $set: { userComment, date } });

    client.close();

    const response = NextResponse.json({ message: "댓글이 수정되었습니다." }, { status: 200 });
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const albumIdKey = url.searchParams.get("albumId");

    const client = await MongoClient.connect(uri);
    const db = client.db();

    const comments = await db
      .collection("comments")
      .find({ albumId: albumIdKey })
      .sort({ date: 1 })
      .toArray();

    const replies = await db
      .collection("replies")
      .find({ commentId: comments[0]._id.toString() })
      .sort({ date: 1 })
      .toArray();

    client.close();

    const response = NextResponse.json({ comments, replies }, { status: 200 });
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { commentId, userId } = await request.json();

    const client = await MongoClient.connect(uri);
    const db = client.db();

    const prevComment = await db.collection("comments").findOne({ _id: new ObjectId(commentId) });

    if (!prevComment) {
      return NextResponse.json({ message: "해당 댓글을 찾을 수 없습니다." }, { status: 404 });
    }

    if (prevComment.userId !== userId) {
      return NextResponse.json({ message: "댓글 삭제 권한이 없습니다." }, { status: 403 });
    }

    await db.collection("comments").deleteOne({ _id: new ObjectId(commentId) });

    return NextResponse.json({ message: "댓글이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
