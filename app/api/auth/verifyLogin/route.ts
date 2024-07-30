import { verify } from "jsonwebtoken";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

require("dotenv").config();

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
      return NextResponse.json({ message: "토큰이 없습니다.", isLoggedIn: false }, { status: 200 });
    }

    // 토큰 검증
    const decoded: any = verify(loginToken, JWT_SECRET);
    if (!decoded) {
      return NextResponse.json(
        { message: "유효하지 않은 토큰입니다.", isLoggedIn: false },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "로그인에 성공했습니다.", isLoggedIn: true },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
