import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";

export const dynamic = "force-dynamic";
require("dotenv").config();

if (!process.env.MONGODB_USERS_URI) throw new Error("env error");
const uri: string = process.env.MONGODB_USERS_URI;

if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: Request) {
  try {
    const { userId, userName, email, password } = await request.json();
    const userImage = `https://carver-bucket.s3.ap-northeast-2.amazonaws.com/user/${userId}`;
    const role = "user";

    const client = await MongoClient.connect(uri);
    const db = client.db();

    // 기존에 가입된 이메일인지 체크하기
    const checkExisting = await db.collection("users").findOne({ email });

    if (checkExisting) {
      client.close();
      return NextResponse.json({ message: "이미 가입된 계정입니다." }, { status: 409 });
    }

    // 비밀번호 암호화
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.collection("users").insertOne({
      userId,
      userName,
      email,
      password: hashedPassword,
      userImage,
      role,
    });

    // 회원가입 성공 후 자동 로그인 처리
    const user = await db.collection("users").findOne({ userId });

    if (!user) {
      client.close();
      return NextResponse.json({ message: "존재하지 않는 아이디입니다." }, { status: 404 });
    }

    // JWT 생성
    const loginToken = sign(
      { userId: user._id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    client.close();

    // 쿠키에 토큰 저장
    const response = NextResponse.json({ message: "로그인 성공" }, { status: 200 });

    response.cookies.set("loginToken", loginToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
