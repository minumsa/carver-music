import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
require("dotenv").config();

if (!process.env.MONGODB_COMMENTS_URI) throw new Error("env error");
const uri: string = process.env.MONGODB_COMMENTS_URI;

if (!process.env.MONGODB_USERS_URI) throw new Error("env error");
const usersUri: string = process.env.MONGODB_USERS_URI;

export async function POST(request: Request) {
  try {
    const { commentId, commentUserId, userId, userName, userComment, albumId, date } =
      await request.json();

    // MongoDB 연결하기
    const client = await MongoClient.connect(uri);
    const db = client.db();

    // comments 컬렉션에 복합 인덱스 추가 (이미 존재하는 경우 오류 무시)
    await db.collection("comments").createIndex({ albumId: 1, date: -1 });

    const status = await db.collection("replies").insertOne({
      commentId,
      commentUserId,
      userId,
      userName,
      userComment,
      albumId,
      date,
      likedUserIds: [],
    });

    // 댓글 수정 후 업데이트된 댓글 목록 보내주기
    const comments = await db.collection("comments").find({ albumId }).sort({ date: 1 }).toArray();

    const usersClient = await MongoClient.connect(usersUri);
    const usersDb = usersClient.db();

    const commentUserIds = comments.map((comment) => comment.userId);
    const commentIds = comments.map((comment) => comment._id.toString());

    const replies = await db
      .collection("replies")
      .find({ commentId: { $in: commentIds } })
      .sort({ date: 1 })
      .toArray();

    const replyUserIds = replies.map((reply) => reply.userId);

    // 모든 userId 목록 병합 후 중복 제거
    const allUserIds = Array.from(new Set([...commentUserIds, ...replyUserIds]));

    const users = await usersDb
      .collection("users")
      .find({ userId: { $in: allUserIds } })
      .toArray();

    const userMap = users.reduce((acc: any, user) => {
      acc[user.userId] = { userImage: user.userImage }; // userId를 키로 하여 userImage 및 userName 저장
      return acc;
    }, {});

    // 각 댓글에 userImage 추가
    const commentsWithImages = comments.map((comment) => ({
      ...comment,
      userImage: userMap[comment.userId]?.userImage || null, // userImage가 없을 경우 null 처리
    }));

    // 각 답글에 userImage 및 userName 추가
    const repliesWithImages = replies.map((reply) => ({
      ...reply,
      userImage: userMap[reply.userId]?.userImage || null,
    }));

    client.close();

    const response = NextResponse.json(
      { comments: commentsWithImages, replies: repliesWithImages },
      { status: 200 },
    );
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { albumId, commentId, userId, userComment, date } = await request.json();

    const client = await MongoClient.connect(uri);
    const db = client.db();

    const prevComment = await db.collection("replies").findOne({ _id: new ObjectId(commentId) });

    if (!prevComment) {
      return NextResponse.json({ message: "해당 댓글을 찾을 수 없습니다." }, { status: 404 });
    }

    if (prevComment.userId !== userId) {
      return NextResponse.json({ message: "댓글 수정 권한이 없습니다." }, { status: 403 });
    }

    await db
      .collection("replies")
      .updateOne({ _id: new ObjectId(commentId) }, { $set: { userComment, date } });

    // 댓글 수정 후 업데이트된 댓글 목록 보내주기
    const comments = await db.collection("comments").find({ albumId }).sort({ date: 1 }).toArray();

    const usersClient = await MongoClient.connect(usersUri);
    const usersDb = usersClient.db();

    const commentUserIds = comments.map((comment) => comment.userId);
    const commentIds = comments.map((comment) => comment._id.toString());

    const replies = await db
      .collection("replies")
      .find({ commentId: { $in: commentIds } })
      .sort({ date: 1 })
      .toArray();

    const replyUserIds = replies.map((reply) => reply.userId);

    // 모든 userId 목록 병합 후 중복 제거
    const allUserIds = Array.from(new Set([...commentUserIds, ...replyUserIds]));

    const users = await usersDb
      .collection("users")
      .find({ userId: { $in: allUserIds } })
      .toArray();

    const userMap = users.reduce((acc: any, user) => {
      acc[user.userId] = { userImage: user.userImage }; // userId를 키로 하여 userImage 및 userName 저장
      return acc;
    }, {});

    // 각 댓글에 userImage 추가
    const commentsWithImages = comments.map((comment) => ({
      ...comment,
      userImage: userMap[comment.userId]?.userImage || null, // userImage가 없을 경우 null 처리
    }));

    // 각 답글에 userImage 및 userName 추가
    const repliesWithImages = replies.map((reply) => ({
      ...reply,
      userImage: userMap[reply.userId]?.userImage || null,
    }));

    client.close();

    const response = NextResponse.json(
      { comments: commentsWithImages, replies: repliesWithImages },
      { status: 200 },
    );
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { replyId, userId, albumId } = await request.json();

    const client = await MongoClient.connect(uri);
    const db = client.db();

    const prevComment = await db.collection("replies").findOne({ _id: new ObjectId(replyId) });

    if (!prevComment) {
      return NextResponse.json({ message: "해당 답글을 찾을 수 없습니다." }, { status: 404 });
    }

    if (prevComment.userId !== userId) {
      return NextResponse.json({ message: "답글 삭제 권한이 없습니다." }, { status: 403 });
    }

    await db.collection("replies").deleteOne({ _id: new ObjectId(replyId) });

    // 댓글 수정 후 업데이트된 댓글 목록 보내주기
    const comments = await db.collection("comments").find({ albumId }).sort({ date: 1 }).toArray();

    const usersClient = await MongoClient.connect(usersUri);
    const usersDb = usersClient.db();

    const commentUserIds = comments.map((comment) => comment.userId);
    const commentIds = comments.map((comment) => comment._id.toString());

    const replies = await db
      .collection("replies")
      .find({ commentId: { $in: commentIds } })
      .sort({ date: 1 })
      .toArray();

    const replyUserIds = replies.map((reply) => reply.userId);

    // 모든 userId 목록 병합 후 중복 제거
    const allUserIds = Array.from(new Set([...commentUserIds, ...replyUserIds]));

    const users = await usersDb
      .collection("users")
      .find({ userId: { $in: allUserIds } })
      .toArray();

    const userMap = users.reduce((acc: any, user) => {
      acc[user.userId] = { userImage: user.userImage }; // userId를 키로 하여 userImage 및 userName 저장
      return acc;
    }, {});

    // 각 댓글에 userImage 추가
    const commentsWithImages = comments.map((comment) => ({
      ...comment,
      userImage: userMap[comment.userId]?.userImage || null, // userImage가 없을 경우 null 처리
    }));

    // 각 답글에 userImage 및 userName 추가
    const repliesWithImages = replies.map((reply) => ({
      ...reply,
      userImage: userMap[reply.userId]?.userImage || null,
    }));

    client.close();

    const response = NextResponse.json(
      { comments: commentsWithImages, replies: repliesWithImages },
      { status: 200 },
    );
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
