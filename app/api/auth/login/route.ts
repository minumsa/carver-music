import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

export const dynamic = "force-dynamic";

require("dotenv").config();

if (!process.env.MONGODB_USERS_URI) throw new Error("env error");
const uri: string = process.env.MONGODB_USERS_URI;

if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: Request) {
  try {
    const { userId, password } = await request.json();

    const client = await MongoClient.connect(uri);
    const db = client.db();

    const user = await db.collection("users").findOne({ userId });

    if (!user) {
      client.close();
      return NextResponse.json({ message: "존재하지 않는 아이디입니다." }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      client.close();
      return NextResponse.json({ message: "비밀번호가 일치하지 않습니다." }, { status: 401 });
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
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const cookies = request.headers.get("cookie");
    const loginToken = cookies
      ?.split(";")
      .find((c) => c.trim().startsWith("loginToken="))
      ?.split("=")[1];

    if (!loginToken) {
      return NextResponse.json({ login: false });
    }

    // 토큰 검증
    const decoded: any = verify(loginToken, JWT_SECRET);
    if (!decoded) {
      return NextResponse.json({ message: "유효하지 않은 토큰입니다." }, { status: 401 });
    }

    // MongoDB 연결하기
    const client = await MongoClient.connect(uri);
    const db = client.db();

    // 사용자 정보 가져오기
    const user = await db.collection("users").findOne({ email: decoded.email });

    client.close();

    if (!user) {
      return NextResponse.json({ message: "존재하지 않는 아이디입니다." }, { status: 404 });
    }

    return NextResponse.json(
      {
        login: true,
        userId: user.userId,
        userName: user.userName,
        userImage: user.userImage,
        role: user.role,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
