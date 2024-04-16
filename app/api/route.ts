import connectMongoDB from "@/app/modules/mongodb";
import { NextResponse } from "next/server";
import { PER_PAGE_COUNT } from "../modules/constants";
import { SortOrder } from "mongoose";
import Music from "@/models/music";

export async function GET(request: Request) {
  try {
    await connectMongoDB();

    const url = new URL(request.url);
    const scrollCount = Number(url.searchParams.get("scrollCount")) ?? 1;
    const currentTagKey = url.searchParams.get("currentTagKey") ?? "";

    interface SortKey {
      [key: string]: SortOrder;
    }

    const sortKey: SortKey = { score: -1, artist: 1 };

    interface Query {
      tagKeys?: string;
    }

    const query: Query = {};

    if (currentTagKey) {
      query.tagKeys = currentTagKey;
    }

    const skipCount = PER_PAGE_COUNT * scrollCount - PER_PAGE_COUNT;
    const albumData =
      scrollCount === 1
        ? await Music.find(query).sort(sortKey).limit(PER_PAGE_COUNT)
        : await Music.find(query)
            .sort(sortKey)
            .skip(skipCount + 1)
            .limit(PER_PAGE_COUNT);
    const albumDataCount = await Music.find(query).count();

    return NextResponse.json({ albumData, albumDataCount });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    require("dotenv").config();
    await connectMongoDB();

    const {
      newSpotifyAlbumData,
      genre,
      link,
      text,
      uploadDate,
      score,
      videos,
      tagKeys,
      blurHash,
      password,
    } = await request.json();
    const {
      id,
      imgUrl,
      artistImgUrl,
      artistId,
      artist,
      album,
      label,
      releaseDate,
      duration,
      tracks,
    } = newSpotifyAlbumData;

    if (password !== process.env.UPLOAD_PASSWORD)
      return NextResponse.json({ message: "password is not correct" }, { status: 401 });

    const existingData = await Music.findOne({ id });

    if (existingData) {
      return NextResponse.json({ message: "album already exists" }, { status: 409 });
    }

    const newData = new Music({
      id,
      imgUrl,
      artistImgUrl,
      artistId,
      artist,
      album,
      label,
      releaseDate,
      genre,
      link,
      text,
      uploadDate,
      duration,
      tracks,
      score,
      videos,
      tagKeys,
      blurHash,
    });
    await newData.save();
    return NextResponse.json(newData.toJSON());
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

// 수정 API
export async function PUT(request: Request) {
  try {
    require("dotenv").config();
    await connectMongoDB();

    const {
      newSpotifyAlbumData,
      originalAlbumId,
      genre,
      link,
      text,
      uploadDate,
      score,
      videos,
      tagKeys,
      blurHash,
      password,
    } = await request.json();
    const {
      id,
      imgUrl,
      artistImgUrl,
      artistId,
      artist,
      album,
      label,
      releaseDate,
      duration,
      tracks,
    } = newSpotifyAlbumData;

    if (password !== process.env.UPLOAD_PASSWORD)
      return NextResponse.json({ message: "password is not correct" }, { status: 401 });

    // 수정할 데이터를 id로 찾아 originalData에 할당
    const originalData = await Music.findOne({ id: originalAlbumId });

    if (!originalData) {
      return NextResponse.json({ message: "Data not found. Cannot update." }, { status: 404 });
    }

    Object.assign(originalData, {
      id,
      imgUrl,
      artistId,
      artistImgUrl,
      artist,
      album,
      label,
      releaseDate,
      genre,
      link,
      text,
      uploadDate,
      duration,
      tracks,
      score,
      videos,
      tagKeys,
      blurHash,
    });

    await originalData.save();
    return NextResponse.json(originalData.toJSON());
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    require("dotenv").config();
    await connectMongoDB();

    const { id, password } = await request.json();

    if (password !== process.env.UPLOAD_PASSWORD)
      return NextResponse.json({ message: "password is not correct" }, { status: 401 });

    const existingData = await Music.findOne({ id });

    if (!existingData) {
      return NextResponse.json({ message: "Data not found" }, { status: 404 });
    }

    await existingData.deleteOne();

    return NextResponse.json({ message: "Data deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
