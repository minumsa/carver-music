import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
require("dotenv").config();

if (!process.env.MONGODB_COMMENTS_URI) throw new Error("env error");
const uri: string = process.env.MONGODB_COMMENTS_URI;

if (!process.env.MONGODB_USERS_URI) throw new Error("env error");
const usersUri: string = process.env.MONGODB_USERS_URI;

export async function PUT(request: Request) {
  try {
    const { albumId, replyId, userId, likedUserIds } = await request.json();

    const client = await MongoClient.connect(uri);
    const db = client.db();

    const prevReply = await db.collection("replies").findOne({ _id: new ObjectId(replyId) });

    if (!prevReply) {
      return NextResponse.json({ message: "해당 답글을 찾을 수 없습니다." }, { status: 404 });
    }

    // FIXME: 로그인 상태가 아닐 때 쿠키 이용하는 방식으로 코드 변경
    if (!userId) {
      return NextResponse.json({ message: "로그인 상태가 아닙니다." }, { status: 401 });
    }

    await db
      .collection("replies")
      .updateOne({ _id: new ObjectId(replyId) }, { $set: { likedUserIds } });

    // FIXME: 댓글 업로드/수정/삭제 후 결괏값으로 댓글 목록을 보내주는데, 관련 코드 중복되는 부분 리팩토링 방법 찾기
    // 댓글 수정 후 업데이트된 댓글 목록 보내주기
    const comments = await db.collection("comments").find({ albumId }).sort({ date: 1 }).toArray();

    const usersClient = await MongoClient.connect(usersUri);
    const usersDb = usersClient.db();

    const commentIds = comments.map((comment) => comment._id.toString());

    const replies = await db
      .collection("replies")
      .find({ commentId: { $in: commentIds } })
      .sort({ date: 1 })
      .toArray();

    const replyUserIds = replies.map((reply) => reply.userId);
    const allUserIds = Array.from([...replyUserIds]);

    const users = await usersDb
      .collection("users")
      .find({ userId: { $in: allUserIds } })
      .toArray();

    const userMap = users.reduce((acc: any, user) => {
      acc[user.userId] = { userImage: user.userImage }; // userId를 키로 하여 userImage 및 userName 저장
      return acc;
    }, {});

    // 각 답글에 userImage 및 userName 추가
    const repliesWithImages = replies.map((reply) => ({
      ...reply,
      userImage: userMap[reply.userId]?.userImage || null,
    }));

    client.close();

    const response = NextResponse.json({ replies: repliesWithImages }, { status: 200 });
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
