import { SortOrder } from "mongoose";

export interface Genres {
  pop: string;
  kpop: string;
  jpop: string;
  rock: string;
  alternative: string;
  disco: string;
  electronic: string;
  jazz: string;
  soul: string;
  folk: string;
  country: string;
  classic: string;
  soundtrack: string;
  // 이 인터페이스로 정의된 객체에는 어떤 문자열 키라도 사용할 수 있음
}

export interface GenreTranslations {
  [key: Genres[keyof Genres]]: string;
}

export interface Tags {
  [key: string]: string;
}

export interface Video {
  title: string;
  url: string;
}

export interface SpotifyAlbumData {
  id: string;
  artistId: string;
  imgUrl: string;
  artistImgUrl: string;
  artist: string;
  album: string;
  label: string;
  releaseDate: string;
  duration: number;
  tracks: number;
}

export interface AlbumInfoLandingPage {
  album: string;
  artist: string;
  artistId: string;
  blurHash: string;
  id: string;
  imgUrl: string;
}

export interface AlbumInfo {
  title: string;
  id: string;
  artistId: string;
  imgUrl: string;
  artistImgUrl: string;
  artist: string;
  album: string;
  label: string;
  releaseDate: string;
  genre: string;
  link: string;
  text: string;
  uploadDate: Date;
  duration: number;
  tracks: number;
  score: number;
  videos: Video[];
  tagKeys: string[];
  blurHash: string;
  markdown?: string;
}

export interface PageProps {
  params: {
    id: string;
    keyword: string;
    page: number;
    genre: string;
    tagName: string;
    date: string;
  };
}

export interface UpdateInfo {
  albumId: string;
  musicVideoTitle?: string;
  musicVideoUrl?: string;
}

type Artist = { name: string };
type Image = { url: string };

export interface SearchData {
  albums: AlbumInfo[];
  artists: Artist[];
  name: string;
  release_date: string;
  images: Image[];
  id: string;
}

export interface SortKey {
  [key: string]: SortOrder;
}

export type CashedAccessToken = string | null;

export interface AlbumFilters {
  scrollCount: number;
  currentTag: string;
}

export interface CalendarData {
  album: string;
  artist: string;
  artistId: string;
  id: string;
  imgUrl: string;
  uploadDate: string;
  score: number;
}

export interface Comment {
  userId: string;
  userComment: string;
  albumId: string;
  date: Date;
}
