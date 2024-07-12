import connectMongoDB from "@/app/modules/mongodb";
import { NextResponse } from "next/server";
import { PER_PAGE_COUNT } from "../modules/constants";
import Music from "@/models/music";
import { SortKey } from "../modules/types";
import { isAdminLoggedIn } from "../modules/api";

interface Query {
  tagKeys?: string; // tag는 모바일 환경에서 태그 클릭 시에만 존재해서 ? 처리
}

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await connectMongoDB();

    const url = new URL(request.url);
    const scrollCount = Number(url.searchParams.get("scrollCount"));
    const tag = url.searchParams.get("tag");

    const sortKey: SortKey = { score: -1, artist: 1 };
    const query: Query = {};

    if (tag) {
      query.tagKeys = tag;
    }

    const skipCount = PER_PAGE_COUNT * scrollCount - PER_PAGE_COUNT;
    const projection = {
      album: 1,
      artist: 1,
      artistId: 1,
      blurHash: 1,
      id: 1,
      _id: 0,
      imgUrl: 1,
    };

    const albumData = await Music.find(query)
      .sort(sortKey)
      .skip(skipCount)
      .limit(PER_PAGE_COUNT)
      .select(projection);

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
      title,
      genre,
      link,
      text,
      uploadDate,
      score,
      videos,
      tagKeys,
      blurHash,
      markdown,
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

    if (!(await isAdminLoggedIn(request))) {
      return NextResponse.json({ message: "관리자 로그인 상태가 아닙니다." }, { status: 401 });
    }

    const existingData = await Music.findOne({ id });

    if (existingData) {
      return NextResponse.json({ message: "이미 존재하는 앨범입니다." }, { status: 409 });
    }

    const newData = new Music({
      title,
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
      markdown,
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
      title,
      genre,
      link,
      text,
      uploadDate,
      score,
      videos,
      tagKeys,
      blurHash,
      markdown,
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

    if (!(await isAdminLoggedIn(request))) {
      return NextResponse.json({ message: "관리자 로그인 상태가 아닙니다." }, { status: 401 });
    }

    // 수정할 데이터를 id로 찾아 originalData에 할당
    const prevData = await Music.findOne({ id: originalAlbumId });

    if (!prevData) {
      return NextResponse.json({ message: "해당 데이터를 찾을 수 없습니다." }, { status: 404 });
    }

    Object.assign(prevData, {
      id,
      imgUrl,
      artistId,
      artistImgUrl,
      artist,
      album,
      label,
      releaseDate,
      title,
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
      markdown,
    });

    await prevData.save();
    return NextResponse.json(prevData.toJSON());
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    require("dotenv").config();
    await connectMongoDB();

    const { id } = await request.json();

    if (!(await isAdminLoggedIn(request))) {
      return NextResponse.json({ message: "관리자 로그인 상태가 아닙니다." }, { status: 401 });
    }

    const existingData = await Music.findOne({ id });

    if (!existingData) {
      return NextResponse.json({ message: "해당 데이터를 찾을 수 없습니다." }, { status: 404 });
    }

    await existingData.deleteOne();

    return NextResponse.json({ message: "데이터가 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
