import { FIRST_SCROLL, PER_PAGE_COUNT } from "./constants";
import { AlbumInfo, SpotifyAlbumData } from "./types";

interface InitialAlbumDataResult {
  albumData: AlbumInfo[];
  totalScrollCount: number;
}

export async function fetchInitialAlbumData(): Promise<InitialAlbumDataResult> {
  try {
    const queryString = `?scrollCount=${FIRST_SCROLL}&currentTagKey=${""}`;
    const url = `https://divdivdiv.com/music/api${queryString}`;

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
    const totalScrollCount = Math.max(1, Math.ceil(albumDataCount / PER_PAGE_COUNT));
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
    const url = `https://divdivdiv.com/music/api/post${queryString}`;

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
    const url = `https://divdivdiv.com/music/api/genre${queryString}`;

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
    const url = `https://divdivdiv.com/music/api/artist${queryString}`;

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
    const url = `https://divdivdiv.com/music/api/tag${queryString}`;

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
    const url = `https://divdivdiv.com/music/api/search${queryString}`;

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

// Spotify API
const fetchSpotifyAccessToken = async () => {
  try {
    const url = "https://accounts.spotify.com/api/token";
    const clientId = "9ba8de463724427689b855dfcabca1b1";
    const clientSecret = "7cfb4b90f97a4b1a8f02f2fe6d2d42bc";
    const basicToken = btoa(`${clientId}:${clientSecret}`);
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basicToken}`,
    };
    const data = "grant_type=client_credentials";

    const accessTokenResponse = await fetch(url, {
      method: "POST",
      headers,
      body: data,
    });

    if (!accessTokenResponse.ok) {
      console.error("Error: Access token fetch failed");
    }

    const accessTokenData = await accessTokenResponse.json();
    return accessTokenData.access_token;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchSpotify = async (albumId: string) => {
  if (!albumId) {
    alert("모든 항목을 채워주세요.");
    return;
  }

  const item = {
    albumId: albumId,
  };

  try {
    const accessToken = await fetchSpotifyAccessToken();
    if (!accessToken) {
      console.error("Error: Access token is not available");
    }

    const albumUrl = `https://api.spotify.com/v1/albums/${item.albumId}`;

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const albumDataResponse = await fetch(albumUrl, { headers });

    if (!albumDataResponse.ok) {
      console.error("Error: albumData fetch failed");
    }

    const albumData = await albumDataResponse.json();
    const { artists, tracks, id, name, label, release_date } = albumData;

    const artistId = artists[0].id;
    const artistUrl = `https://api.spotify.com/v1/artists/${artistId}`;

    const artistDataResponse = await fetch(artistUrl, { headers });

    if (!artistDataResponse.ok) {
      console.error("Error: artistDataResponse fetch failed");
    }

    const artistData = await artistDataResponse.json();
    const duration = Math.floor(
      tracks.items.map((data: any) => data.duration_ms).reduce((a: number, b: number) => a + b) /
        1000
    );

    const fetchedData: SpotifyAlbumData = {
      id: id,
      artistId: artists[0].id,
      imgUrl: albumData.images[0].url,
      artistImgUrl: artistData.images[0].url,
      artist: artists[0].name,
      album: name,
      label: label,
      releaseDate: release_date,
      tracks: tracks.items.length,
      duration: duration,
    };

    return fetchedData;
  } catch (error) {
    console.error(error);
  }
};

export const searchSpotify = async (searchKeyword: string) => {
  try {
    const accessToken = await fetchSpotifyAccessToken();
    if (!accessToken) {
      console.error("Error: Access token is not available");
    }

    const searchUrl = `https://api.spotify.com/v1/search?q=${searchKeyword}&type=album`;

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const searchDataResponse = await fetch(searchUrl, { headers });

    if (!searchDataResponse.ok) {
      console.error("Error: albumData fetch failed");
    }

    const searchData = await searchDataResponse.json();
    // 전체 검색 데이터에서 상위 5개만 가져오기
    const data = searchData.albums.items.slice(0, 5);

    return data;
  } catch (error) {
    console.error(error);
  }
};
