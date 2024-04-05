import { FIRST_SCROLL, PER_PAGE_COUNT } from "./constants";
import { AlbumInfo, SpotifyAlbumData } from "./types";

interface InitialAlbumDataResult {
  albumData: AlbumInfo[];
  totalScrollCount: number;
}

export async function fetchInitialAlbumData(): Promise<InitialAlbumDataResult> {
  try {
    const queryString = `?scrollCount=${FIRST_SCROLL}&currentTagKey=${""}`;
    const url = `https://music.divdivdiv.com/api${queryString}`;

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
    const totalScrollCount = Math.ceil(albumDataCount / PER_PAGE_COUNT);
    return { albumData, totalScrollCount };
  } catch (error) {
    throw new Error("Failed to fetch music data");
  }
}

export interface AlbumFilters {
  scrollCount: number;
  currentTagKey: string;
}

interface AlbumDataResult {
  albumData: AlbumInfo[];
  albumDataCount: number;
}

export async function fetchAlbumData(albumFilters: AlbumFilters): Promise<AlbumDataResult> {
  const { scrollCount, currentTagKey } = albumFilters;

  try {
    const queryString = `?scrollCount=${scrollCount}&currentTagKey=${currentTagKey}`;
    const url = `/api${queryString}`;

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

export async function fetchPostData(currentId: string): Promise<AlbumInfo> {
  try {
    const queryString = `?albumId=${currentId}`;
    const url = `https://music.divdivdiv.com/api/post${queryString}`;

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

interface GenreDataResult {
  genreData: AlbumInfo[];
  genreDataCount: number;
}

export async function fetchGenreData(
  currentGenre: string,
  currentPage: number
): Promise<GenreDataResult> {
  try {
    const queryString = `?currentGenre=${currentGenre}&currentPage=${currentPage}`;
    const url = `https://music.divdivdiv.com/api/genre${queryString}`;

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
  currentPage: number
): Promise<ArtistDataResult> {
  try {
    const queryString = `?artistId=${artistId}&currentPage=${currentPage}`;
    const url = `https://music.divdivdiv.com/api/artist${queryString}`;

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
  currentPage: number
): Promise<TagDataResult> {
  try {
    const queryString = `?currentTag=${currentTag}&currentPage=${currentPage}`;
    const url = `https://music.divdivdiv.com/api/tag${queryString}`;

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
  currentPage: number
): Promise<SearchDataResult> {
  try {
    const queryString = `?currentKeyword=${currentKeyword}&currentPage=${currentPage}`;
    const url = `https://music.divdivdiv.com/api/search${queryString}`;

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

export async function fetchAlbumById(albumId: string) {
  try {
    const queryString = `?albumId=${albumId}`;
    const url = `/api/post${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to update music data");
    }

    let data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

interface Video {
  title: string;
  url: string;
}

export interface UploadData {
  newSpotifyAlbumData: SpotifyAlbumData;
  genre: string;
  link: string;
  text: string;
  uploadDate: Date;
  score: number;
  videos: Video[];
  tagKeys: string[];
  blurHash: string;
}

export interface UpdateDataParams {
  newData: UploadData;
  password: string;
}

export async function uploadData({ newData, password }: UpdateDataParams) {
  const { newSpotifyAlbumData, genre, link, text, uploadDate, score, videos, tagKeys, blurHash } =
    newData;

  if (newData) {
    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newSpotifyAlbumData,
          genre,
          link,
          text,
          uploadDate,
          score,
          videos,
          tagKeys,
          blurHash,
          password: password,
        }),
      });

      if (response.status === 401) {
        alert("관리자 비밀번호가 틀렸습니다.");
      } else if (response.status === 409) {
        alert("이미 존재하는 데이터입니다.");
      } else if (!response.ok) {
        throw new Error("데이터 업로드에 실패했습니다.");
      } else {
        alert("데이터가 성공적으로 저장되었습니다.");
      }

      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Error: ", error);
    }
  }
}

export const updateData = async ({ newData, password }: UpdateDataParams) => {
  const { newSpotifyAlbumData, genre, link, text, uploadDate, score, videos, tagKeys, blurHash } =
    newData;

  if (newData !== null) {
    try {
      const response = await fetch("/api", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
        }),
      });

      if (response.status === 401) {
        alert("관리자 비밀번호가 틀렸습니다.");
      } else if (response.status === 404) {
        alert("존재하지 않는 앨범입니다.");
      } else if (!response.ok) {
        throw new Error("데이터 수정에 실패했습니다.");
      } else {
        alert("데이터가 성공적으로 수정되었습니다.");
      }
    } catch (error) {
      console.error(error);
    }
  }
};

export const deleteData = async (id: string) => {
  const userPassword = prompt("관리자 비밀번호를 입력해주세요.");

  try {
    const response = await fetch("/api", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id, password: userPassword }),
    });

    if (response.status === 401) {
      alert("관리자 비밀번호가 틀렸습니다.");
    } else if (response.status === 404) {
      alert("존재하지 않는 앨범입니다.");
    } else if (!response.ok) {
      throw new Error("Failed to delete music data");
    } else {
      alert("데이터가 성공적으로 삭제되었습니다.");
    }
  } catch (error) {
    console.error(error);
  }
};

export const fetchSpotifyAccessToken = async () => {
  try {
    const url = `/api/token`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch spotify access token");
    }

    const accessToken = await response.json();

    if (!accessToken) {
      throw new Error("Failed to retrieve access token from response data");
    }

    return accessToken;
  } catch (error) {
    throw new Error("Failed to fetch spotify access token");
  }
};

export const fetchSpotify = async (albumId: string) => {
  try {
    if (!albumId) {
      alert("모든 항목을 채워주세요.");
      return;
    }

    const queryString = `?albumId=${albumId}`;
    const url = `/api/spotify/fetch${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error: Failed to fetch spotify data");
    }

    const { fetchedData } = await response.json();
    return fetchedData;
  } catch (error) {
    throw new Error("Error: Failed to fetch spotify data");
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

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error("Error: Failed to search spotify data");
  }
};

// export const searchSpotify = async (searchKeyword: string) => {
//   try {
//     const { accessToken } = await fetchSpotifyAccessToken();

//     if (!accessToken) {
//       console.error("Error: Access token is not available");
//     }

//     const searchUrl = `https://api.spotify.com/v1/search?q=${searchKeyword}&type=album`;

//     const headers = {
//       Authorization: `Bearer ${accessToken}`,
//     };
//     const searchDataResponse = await fetch(searchUrl, { headers });

//     if (!searchDataResponse.ok) {
//       console.error("Error: albumData fetch failed");
//     }

//     const searchData = await searchDataResponse.json();
//     // 전체 검색 데이터에서 상위 5개만 가져오기
//     const data = searchData.albums.items.slice(0, 5);

//     return data;
//   } catch (error) {
//     console.error(error);
//   }
// };
