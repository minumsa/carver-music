import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
require("dotenv").config();

const Bucket = process.env.AMPLIFY_BUCKET;
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("img") as File[];
    const userId = formData.get("userId") as string;
    const Body = (await files[0].arrayBuffer()) as Buffer;

    s3.send(
      new PutObjectCommand({
        Bucket,
        Key: userId, // 저장시 넣고 싶은 파일 이름
        Body,
        ContentType: "image/jpg",
      }),
    );

    return NextResponse.json({ message: "OK" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
