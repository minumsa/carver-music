import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

require("dotenv").config();

if (!process.env.MONGODB_COMMENTS_URI) throw new Error("env error");
const uri: string = process.env.MONGODB_COMMENTS_URI;

export async function POST(request: Request) {
  try {
    const { userId, userComment, albumId, date } = await request.json();

    // MongoDB 연결하기
    const client = await MongoClient.connect(uri);
    const db = client.db();

    const status = await db.collection("comments").insertOne({
      userId,
      userComment,
      albumId,
      date,
    });

    const response = NextResponse.json({ message: "로그인 성공" }, { status: 200 });
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

    // MongoDB 연결하기
    const client = await MongoClient.connect(uri);
    const db = client.db();

    const comments = await db.collection("comments").find({ albumId: albumIdKey }).toArray();

    client.close();

    const response = NextResponse.json({ comments }, { status: 200 });
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
