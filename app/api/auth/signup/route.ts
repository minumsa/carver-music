import { MongoClient } from "mongodb";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

if (!process.env.MONGODB_USERS_URI) throw new Error("env error");
const uri: string = process.env.MONGODB_USERS_URI;

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email") ?? "";
    const password = url.searchParams.get("password") ?? "";

    // MongoDB 연결하기
    const client = await MongoClient.connect(uri);
    const db = client.db();

    // 기존에 가입된 이메일인지 체크하기
    const checkExisting = await db.collection("users").findOne({ email });

    if (checkExisting) {
      client.close();
      return NextResponse.json({ message: "이미 가입된 계정입니다." }, { status: 422 });
    }

    const status = await db.collection("users").insertOne({
      email,
      // 비밀번호 암호화
      password: hash(password, 12),
    });

    // 성공시 response
    return NextResponse.json({ message: "계정을 성공적으로 생성했습니다." }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
