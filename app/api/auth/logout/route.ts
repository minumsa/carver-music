import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

require("dotenv").config();

export async function GET(request: Request) {
  try {
    const cookies = request.headers.get("cookie");
    const loginToken = cookies
      ?.split(";")
      .find((c) => c.trim().startsWith("loginToken="))
      ?.split("=")[1];

    if (!loginToken) {
      return NextResponse.json({ message: "로그아웃할 수 없습니다: 토큰 없음" }, { status: 401 });
    }

    // 쿠키 제거 설정
    const response = NextResponse.json({ message: "로그아웃 성공" }, { status: 200 });
    response.cookies.delete("loginToken");
    return response;
  } catch (error) {
    console.error("로그아웃 중 에러:", error);
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}
