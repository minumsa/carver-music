import { toast } from "react-toastify";
import { BASE_URL, MIN_SCROLL_COUNT, PER_PAGE_COUNT } from "./constants";
import { AlbumFilters, AlbumInfo, AlbumInfoLandingPage, SortKey, SpotifyAlbumData } from "./types";
import connectMongoDB from "./mongodb";
import Music from "@/models/music";
import { getYearMonthFromDate } from "./utils";

interface InitialAlbumDataResult {
  albumData: AlbumInfo[];
  totalScrollCount: number;
}

export async function fetchInitialAlbumData(): Promise<InitialAlbumDataResult> {
  try {
    const queryString = `?scrollCount=${MIN_SCROLL_COUNT}`;
    const url = `${BASE_URL}/api${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch initial music data");
    }

    const { albumData, albumDataCount } = await response.json();
    const totalScrollCount = Math.ceil(albumDataCount / PER_PAGE_COUNT);

    return { albumData, totalScrollCount };
  } catch (error) {
    throw new Error("Failed to fetch initial music data");
  }
}

interface AlbumDataResult {
  albumData: AlbumInfoLandingPage[];
  albumDataCount: number;
}

export async function fetchAlbumDataCSR(albumFilters: AlbumFilters): Promise<AlbumDataResult> {
  try {
    const { scrollCount, currentTag } = albumFilters;
    const queryString = `?scrollCount=${scrollCount}&tag=${currentTag}`;
    const url = `${BASE_URL}/api${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch music data");
    }

    const { albumData, albumDataCount } = await response.json();
    return { albumData, albumDataCount };
  } catch (error) {
    throw new Error("Failed to fetch music data");
  }
}

interface Query {
  tagKeys?: string; // tag는 모바일 환경에서 태그 클릭 시에만 존재해서 ? 처리
}

export async function fetchAlbumDataSSR() {
  try {
    const albumFilters: AlbumFilters = {
      scrollCount: 1,
      currentTag: "",
    };
    const { scrollCount, currentTag } = albumFilters;

    await connectMongoDB();

    const sortKey: SortKey = { score: -1, artist: 1 };
    const query: Query = {};

    if (currentTag) {
      query.tagKeys = currentTag;
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
    throw new Error("Failed to fetch music data");
  }
}

export async function fetchPostData(currentId: string): Promise<AlbumInfo> {
  try {
    const queryString = `?albumId=${currentId}`;
    const url = `${BASE_URL}/api/post${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch post data");
    }

    const postData: AlbumInfo = await response.json();

    return postData;
  } catch (error) {
    throw new Error("Failed to fetch post data");
  }
}

export async function fetchRandomAlbumId(): Promise<string> {
  try {
    const url = `${BASE_URL}/api/randomPost`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch random album id");
    }

    const albumId = await response.json();

    return albumId;
  } catch (error) {
    throw new Error("Failed to fetch post data");
  }
}

interface GenreDataResult {
  genreData: AlbumInfo[];
  genreDataCount: number;
}

export async function fetchGenreData(
  currentGenre: string,
  currentPage: number,
): Promise<GenreDataResult> {
  try {
    const queryString = `?currentGenre=${currentGenre}&currentPage=${currentPage}`;
    const url = `${BASE_URL}/api/genre${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch genre data");
    }

    const { genreData, genreDataCount } = await response.json();
    return { genreData, genreDataCount };
  } catch (error) {
    throw new Error("Failed to fetch genre data");
  }
}

interface ArtistDataResult {
  artistData: AlbumInfo[];
  artistDataCount: number;
}

export async function fetchArtistData(
  artistId: string,
  currentPage: number,
): Promise<ArtistDataResult> {
  try {
    const queryString = `?artistId=${artistId}&currentPage=${currentPage}`;
    const url = `${BASE_URL}/api/artist${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch artist data");
    }

    const { artistData, artistDataCount } = await response.json();
    return { artistData, artistDataCount };
  } catch (error) {
    throw new Error("Failed to fetch artist data");
  }
}

interface TagDataResult {
  tagData: AlbumInfo[];
  tagDataCount: number;
}

export async function fetchTagData(
  currentTag: string,
  currentPage: number,
): Promise<TagDataResult> {
  try {
    const queryString = `?currentTag=${currentTag}&currentPage=${currentPage}`;
    const url = `${BASE_URL}/api/tag${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch artist data");
    }

    const { tagData, tagDataCount } = await response.json();
    return { tagData, tagDataCount };
  } catch (error) {
    throw new Error("Failed to fetch tag data");
  }
}

interface SearchDataResult {
  searchData: AlbumInfo[];
  searchDataCount: number;
}

export async function fetchSearchData(
  currentKeyword: string,
  currentPage: number,
): Promise<SearchDataResult> {
  try {
    const queryString = `?currentKeyword=${currentKeyword}&currentPage=${currentPage}`;
    const url = `${BASE_URL}/api/search${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to search data");
    }

    const { searchData, searchDataCount } = await response.json();
    return { searchData, searchDataCount };
  } catch (error) {
    throw new Error("Failed to search data");
  }
}

interface Video {
  title: string;
  url: string;
}

export interface NewData {
  title?: string;
  newSpotifyAlbumData: SpotifyAlbumData;
  genre: string;
  link: string;
  text: string;
  uploadDate: Date;
  score: number;
  videos?: Video[];
  tagKeys: string[];
  blurHash: string;
  markdown?: string;
}

export interface NewDataForUpdate extends NewData {
  originalAlbumId: string;
}

export interface UploadDataParams {
  newData: NewData;
}

export interface UpdateDataParams {
  newData: NewDataForUpdate;
}

export async function uploadData({ newData }: UploadDataParams) {
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
  } = newData;

  if (newData) {
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

      if (response.status === 401) {
        toast.warn("관리자 로그인 상태가 아닙니다. 🙀");
      } else if (response.status === 409) {
        toast.warn("이미 존재하는 앨범입니다! 🙀");
      } else if (!response.ok) {
        toast.error("데이터 업로드 실패 😿");
        throw new Error("데이터 업로드에 실패했습니다.");
      } else {
        toast.success("데이터 업로드 완료 😻");
      }

      return response;
    } catch (error) {
      console.error("Error: ", error);
    }
  }
}

export const updateData = async ({ newData }: UpdateDataParams) => {
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
  } = newData;

  if (newData !== null) {
    try {
      const response = await fetch(`${BASE_URL}/api`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
        }),
      });

      if (response.status === 401) {
        toast.warn("관리자 로그인 상태가 아닙니다. 😾");
      } else if (response.status === 404) {
        toast.warn("존재하지 않는 앨범입니다. 🙀");
      } else if (!response.ok) {
        toast.error("데이터 수정에 실패했습니다. 😿");
      } else {
        toast.success("데이터를 성공적으로 수정했습니다. 😻");
      }

      return response;
    } catch (error) {
      console.error(error);
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

    if (response.status === 401) {
      toast.warn("관리자 로그인 상태가 아닙니다. 😾");
    } else if (response.status === 404) {
      toast.warn("존재하지 않는 데이터입니다. 🙀");
    } else if (!response.ok) {
      toast.warn("데이터를 삭제하는 데 실패했습니다. 😿");
    } else {
      toast.warn("데이터가 성공적으로 삭제되었습니다. 😻");
    }

    return response;
  } catch (error) {
    console.error(error);
  }
};

export const fetchSpotify = async (albumId: string) => {
  if (!albumId) {
    alert("모든 항목을 채워주세요.");
    return;
  }

  try {
    const queryString = `?albumId=${albumId}`;
    const url = `/api/spotify/fetch${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const fetchedData = await response.json();
    return fetchedData;
  } catch (error) {
    console.error(error);
  }
};

export const searchSpotify = async (searchKeyword: string) => {
  try {
    const queryString = `?searchKeyword=${searchKeyword}`;
    const url = `/api/spotify/search${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const searchData = await response.json();
    return searchData;
  } catch (error) {
    console.error(error);
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

export async function fetchCalendarDataCSR(currentDate: any) {
  try {
    const { year, month } = getYearMonthFromDate(currentDate);
    const queryString = `?year=${year}&month=${month}`;
    const url = `${BASE_URL}/api/calendar${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch initial music data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Failed to fetch initial music data");
  }
}
