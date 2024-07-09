import { toast } from "react-toastify";
import { BASE_URL, MIN_SCROLL_COUNT, PER_PAGE_COUNT } from "./constants";
import { AlbumFilters, AlbumInfo, AlbumInfoLandingPage, SortKey, SpotifyAlbumData } from "./types";
import connectMongoDB from "./mongodb";
import Music from "@/models/music";
import {
  getYearMonthFromDate,
  validateEmail,
  validatePassword,
  validateUserId,
  validateUserName,
} from "./utils";
import { verify } from "jsonwebtoken";

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

    // const url = `https://music.divdivdiv.com/api${queryString}`;
    // const url = `http://localhost:3000/api${queryString}`; // localhost url

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
      // alert("관리자 비밀번호가 틀렸습니다.");
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
        // 문자열에서 연도와 월을 추출하여 새로운 필드를 추가
        $addFields: {
          year: { $substr: ["$uploadDate", 0, 4] },
          month: { $substr: ["$uploadDate", 5, 2] },
        },
      },
      {
        // 연도와 월이 일치하는 문서만 필터링
        $match: {
          year: year.toString(),
          month: month.toString().padStart(2, "0"),
        },
      },
      {
        // 필요한 필드만 포함
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

export async function attemptSignUp(
  userId: string,
  userName: string,
  email: string,
  password: string,
) {
  try {
    if (!validateUserId(userId)) {
      toast.error(
        "사용자 아이디는 영어 소문자와 숫자만 입력 가능하고 최소 3자, 최대 15자여야 합니다. 🙀",
      );
      return;
    }

    if (!validateUserName(userName)) {
      toast.error("닉네임은 영어, 한글, 숫자만 입력 가능하고 최소 2자, 최대 10자여야 합니다. 🙀");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("유효하지 않은 이메일 형식입니다. 🙀");
      return;
    }

    if (!validatePassword(password)) {
      toast.error("비밀번호는 최소 10자 이상이어야 하며, 특수문자를 포함해야 합니다. 🙀");
      return;
    }

    // 회원가입 API 호출
    const url = `${BASE_URL}/api/auth/signup`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        userName,
        email,
        password,
      }),
    });

    if (response.status === 422) {
      toast.error("이미 가입된 이메일입니다. 🙀");
    } else if (!response.ok) {
      toast.error("회원가입에 실패했습니다. 😿");
    } else {
      toast.success("회원가입에 성공했습니다. 😻");
    }

    return response;
  } catch (error) {
    console.error("Error: ", error);
    toast.error("회원가입 과정에서 오류가 발생했습니다. 😿");
  }
}

export async function attemptLogin(userId: string, password: string) {
  try {
    const url = `${BASE_URL}/api/auth/login`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        password,
      }),
    });

    if (!response.ok) {
      toast.error("로그인에 실패했습니다. 😿");
    } else {
      toast.success("로그인에 성공했습니다. 😻");
    }

    return response;
  } catch (error) {
    console.error("Error: ", error);
  }
}

export async function getUserInfo() {
  try {
    const url = `${BASE_URL}/api/auth/login`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      toast.error("로그인에 실패했습니다. 😿");
    } else {
      toast.success("로그인에 성공했습니다. 😻");
    }

    return response.json();
  } catch (error) {
    console.error("Error: ", error);
  }
}

export function parseCookies(cookieHeader: string): Record<string, string> {
  return cookieHeader.split(";").reduce(
    (cookies, cookie) => {
      const [name, ...rest] = cookie.split("=");
      cookies[name.trim()] = rest.join("=").trim();
      return cookies;
    },
    {} as Record<string, string>,
  );
}

export async function isAdminLoggedIn(request: Request): Promise<boolean> {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");
  const JWT_SECRET = process.env.JWT_SECRET;

  try {
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) {
      return false;
    }

    const cookies = parseCookies(cookieHeader);
    const loginToken = cookies["loginToken"];
    if (!loginToken) {
      return false;
    }

    const decoded: any = verify(loginToken, JWT_SECRET);

    if (!decoded || decoded.role !== "admin") {
      return false;
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
