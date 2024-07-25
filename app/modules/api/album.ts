import { toast } from "react-toastify";
import { AlbumFilters, AlbumData, SortKey } from "../types";
import connectMongoDB from "../mongodb";
import Music from "@/models/music";
import { getYearMonthFromDate } from "../utils";
import { PER_PAGE_COUNT } from "../config";
import { BASE_URL } from "../constants/apiUrls";
import { AlbumError } from "../errors";
import {
  AlbumDataResult,
  ArtistDataResult,
  GenreDataResult,
  Query,
  SearchDataResult,
  TagDataResult,
  UpdateDataParams,
  UploadDataParams,
} from "./albumTypes";

export async function fetchAlbumDataCSR(albumFilters: AlbumFilters): Promise<AlbumDataResult> {
  try {
    const { scrollCount, activeTag } = albumFilters;
    const queryString = `?scrollCount=${scrollCount}&tag=${activeTag}`;
    const url = `${BASE_URL}/api${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = AlbumError.fromResponse(response);
      toast.error(error.message);
      throw error;
    }

    const { albumData, albumDataCount } = await response.json();
    return { albumData, albumDataCount };
  } catch (error) {
    if (!(error instanceof AlbumError)) {
      const systemErrorMessage = "앨범 데이터 처리 중 시스템 오류가 발생했습니다.";
      toast.error(systemErrorMessage);
      throw new Error(systemErrorMessage);
    }
    throw error;
  }
}

export async function fetchAlbumDataSSR() {
  try {
    const albumFilters: AlbumFilters = {
      scrollCount: 1,
      activeTag: "",
    };
    const { scrollCount, activeTag } = albumFilters;

    await connectMongoDB();

    const sortKey: SortKey = { score: -1, artist: 1 };
    const query: Query = {};

    if (activeTag) {
      query.tagKeys = activeTag;
    }

    const skipCount = PER_PAGE_COUNT * scrollCount - PER_PAGE_COUNT;
    const projection = {
      album: 1,
      artist: 1,
      artistId: 1,
      blurHash: 1,
      _id: 0,
      id: 1,
      imgUrl: 1,
    };

    const albumData = await Music.find(query)
      .sort(sortKey)
      .skip(skipCount)
      .limit(PER_PAGE_COUNT)
      .select(projection);
    const albumDataCount = await Music.find(query).count();

    // FIXME: 에러 막으려 도입, 추후에 나은 방법 찾으면 리팩토링
    const simplifiedAlbumData = JSON.parse(JSON.stringify(albumData));
    const simplifiedAlbumDataCount = JSON.parse(JSON.stringify(albumDataCount));

    return { albumData: simplifiedAlbumData, albumDataCount: simplifiedAlbumDataCount };
  } catch (error) {
    if (!(error instanceof AlbumError)) {
      const systemErrorMessage = "앨범 데이터 처리 중 시스템 오류가 발생했습니다.";
      toast.error(systemErrorMessage);
      throw new Error(systemErrorMessage);
    }
    throw error;
  }
}

export async function fetchPostData(activeId: string): Promise<AlbumData> {
  try {
    const queryString = `?albumId=${activeId}`;
    const url = `${BASE_URL}/api/post${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = AlbumError.fromResponse(response);
      toast.error(error.message);
      throw error;
    }

    const postData: AlbumData = await response.json();
    return postData;
  } catch (error) {
    if (!(error instanceof AlbumError)) {
      const systemErrorMessage = "앨범 데이터 처리 중 시스템 오류가 발생했습니다.";
      toast.error(systemErrorMessage);
      throw new Error(systemErrorMessage);
    }
    throw error;
  }
}

export async function getRandomAlbumId(): Promise<string> {
  try {
    const url = `${BASE_URL}/api/randomPost`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = AlbumError.fromResponse(response);
      toast.error(error.message);
      throw error;
    }

    const albumId = await response.json();
    return albumId;
  } catch (error) {
    if (!(error instanceof AlbumError)) {
      const systemErrorMessage = "앨범 데이터 처리 중 시스템 오류가 발생했습니다.";
      toast.error(systemErrorMessage);
      throw new Error(systemErrorMessage);
    }
    throw error;
  }
}

export async function fetchGenreData(
  activeGenre: string,
  activePage: number,
): Promise<GenreDataResult> {
  try {
    const queryString = `?activeGenre=${activeGenre}&activePage=${activePage}`;
    const url = `${BASE_URL}/api/genre${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = AlbumError.fromResponse(response);
      toast.error(error.message);
      throw error;
    }

    const { genreData, genreDataCount } = await response.json();
    return { genreData, genreDataCount };
  } catch (error) {
    if (!(error instanceof AlbumError)) {
      const systemErrorMessage = "앨범 데이터 처리 중 시스템 오류가 발생했습니다.";
      toast.error(systemErrorMessage);
      throw new Error(systemErrorMessage);
    }
    throw error;
  }
}

export async function fetchArtistData(
  artistId: string,
  activePage: number,
): Promise<ArtistDataResult> {
  try {
    const queryString = `?artistId=${artistId}&activePage=${activePage}`;
    const url = `${BASE_URL}/api/artist${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = AlbumError.fromResponse(response);
      toast.error(error.message);
      throw error;
    }

    const { artistData, artistDataCount } = await response.json();
    return { artistData, artistDataCount };
  } catch (error) {
    if (!(error instanceof AlbumError)) {
      const systemErrorMessage = "앨범 데이터 처리 중 시스템 오류가 발생했습니다.";
      toast.error(systemErrorMessage);
      throw new Error(systemErrorMessage);
    }
    throw error;
  }
}

export async function fetchTagData(activeTag: string, activePage: number): Promise<TagDataResult> {
  try {
    const queryString = `?activeTag=${activeTag}&activePage=${activePage}`;
    const url = `${BASE_URL}/api/tag${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = AlbumError.fromResponse(response);
      toast.error(error.message);
      throw error;
    }

    const { tagData, tagDataCount } = await response.json();
    return { tagData, tagDataCount };
  } catch (error) {
    if (!(error instanceof AlbumError)) {
      const systemErrorMessage = "앨범 데이터 처리 중 시스템 오류가 발생했습니다.";
      toast.error(systemErrorMessage);
      throw new Error(systemErrorMessage);
    }
    throw error;
  }
}

export async function fetchSearchData(
  activeKeyword: string,
  activePage: number,
): Promise<SearchDataResult> {
  try {
    const queryString = `?activeKeyword=${activeKeyword}&activePage=${activePage}`;
    const url = `${BASE_URL}/api/search${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = AlbumError.fromResponse(response);
      toast.error(error.message);
      throw error;
    }

    const { searchData, searchDataCount } = await response.json();
    return { searchData, searchDataCount };
  } catch (error) {
    if (!(error instanceof AlbumError)) {
      const systemErrorMessage = "앨범 데이터 처리 중 시스템 오류가 발생했습니다.";
      toast.error(systemErrorMessage);
      throw new Error(systemErrorMessage);
    }
    throw error;
  }
}

export async function uploadData({ updatedData }: UploadDataParams) {
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
  } = updatedData;

  if (updatedData) {
    try {
      const response = await fetch(`${BASE_URL}/api`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
        }),
      });

      if (!response.ok) {
        const error = AlbumError.fromResponse(response);
        toast.error(error.message);
        throw error;
      }

      return response;
    } catch (error) {
      if (!(error instanceof AlbumError)) {
        const systemErrorMessage = "앨범 데이터 처리 중 시스템 오류가 발생했습니다.";
        toast.error(systemErrorMessage);
        throw new Error(systemErrorMessage);
      }
      throw error;
    }
  }
}

export const updateData = async ({ updatedData }: UpdateDataParams) => {
  const {
    newSpotifyAlbumData,
    prevAlbumId,
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
  } = updatedData;

  if (updatedData !== null) {
    try {
      const response = await fetch(`${BASE_URL}/api`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newSpotifyAlbumData,
          prevAlbumId,
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
        }),
      });

      if (!response.ok) {
        const error = AlbumError.fromResponse(response);
        toast.error(error.message);
        throw error;
      }

      return response;
    } catch (error) {
      if (!(error instanceof AlbumError)) {
        const systemErrorMessage = "앨범 데이터 처리 중 시스템 오류가 발생했습니다.";
        toast.error(systemErrorMessage);
        throw new Error(systemErrorMessage);
      }
      throw error;
    }
  }
};

export const deleteData = async (id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/api`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      const error = AlbumError.fromResponse(response);
      toast.error(error.message);
      throw error;
    }

    return response;
  } catch (error) {
    if (!(error instanceof AlbumError)) {
      const systemErrorMessage = "앨범 데이터 처리 중 시스템 오류가 발생했습니다.";
      toast.error(systemErrorMessage);
      throw new Error(systemErrorMessage);
    }
    throw error;
  }
};

export async function fetchCalendarDataSSR(year: number, month: number) {
  try {
    await connectMongoDB();

    const pipeline = [
      {
        $addFields: {
          year: { $substr: ["$uploadDate", 0, 4] },
          month: { $substr: ["$uploadDate", 5, 2] },
        },
      },
      {
        $match: {
          year: year.toString(),
          month: month.toString().padStart(2, "0"),
        },
      },
      {
        $project: {
          _id: 0,
          album: 1,
          artist: 1,
          artistId: 1,
          id: 1,
          imgUrl: 1,
          score: 1,
          uploadDate: 1,
        },
      },
    ];

    const calendarData = await Music.aggregate(pipeline);
    const simplifiedCalendarData = JSON.parse(JSON.stringify(calendarData));
    return simplifiedCalendarData;
  } catch (error) {
    throw new Error("Failed to fetch initial music data");
  }
}

export async function fetchCalendarDataCSR(activeDate: Date) {
  try {
    const { year, month } = getYearMonthFromDate(activeDate);
    const queryString = `?year=${year}&month=${month}`;
    const url = `${BASE_URL}/api/calendar${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = AlbumError.fromResponse(response);
      toast.error(error.message);
      throw error;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (!(error instanceof AlbumError)) {
      const systemErrorMessage = "앨범 데이터 처리 중 시스템 오류가 발생했습니다.";
      toast.error(systemErrorMessage);
      throw new Error(systemErrorMessage);
    }
    throw error;
  }
}
