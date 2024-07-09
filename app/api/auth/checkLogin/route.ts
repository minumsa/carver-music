import { verify } from "jsonwebtoken";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

require("dotenv").config();

if (!process.env.MONGODB_USERS_URI) throw new Error("env error");
const uri: string = process.env.MONGODB_USERS_URI;

if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");
const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(request: Request) {
  try {
    const cookies = request.headers.get("cookie");
    const loginToken = cookies
      ?.split(";")
      .find((c) => c.trim().startsWith("loginToken="))
      ?.split("=")[1];

    if (!loginToken) {
      return NextResponse.json({ message: "토큰이 없습니다." }, { status: 200 });
      // return NextResponse.json({ message: "토큰이 없습니다." }, { status: 401 });
    }

    // 토큰 검증
    const decoded: any = verify(loginToken, JWT_SECRET);
    if (!decoded) {
      return NextResponse.json({ message: "유효하지 않은 토큰입니다." }, { status: 200 });
      // return NextResponse.json({ message: "유효하지 않은 토큰입니다." }, { status: 401 });
    }

    return NextResponse.json({ status: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
