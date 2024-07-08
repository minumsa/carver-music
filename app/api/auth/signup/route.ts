import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

require("dotenv").config();
if (!process.env.MONGODB_USERS_URI) throw new Error("env error");
const uri: string = process.env.MONGODB_USERS_URI;

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const name = url.searchParams.get("name");
    const email = url.searchParams.get("email");
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

    // 비밀번호 암호화
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const status = await db.collection("users").insertOne({
      id,
      name,
      email,
      password: hashedPassword,
    });

    // 성공시 response
    return NextResponse.json({ message: "계정을 성공적으로 생성했습니다." }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
