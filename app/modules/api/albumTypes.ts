import { AlbumData, AlbumDataLandingPage, SpotifyAlbumData } from "../types";

export interface Query {
  tagKeys?: string; // tag는 모바일 환경에서 태그 클릭 시에만 존재해서 ? 처리
}

// return 타입
export interface AlbumDataResult {
  albumData: AlbumDataLandingPage[];
  albumDataCount: number;
}

export interface GenreDataResult {
  genreData: AlbumData[];
  genreDataCount: number;
}

export interface ArtistDataResult {
  artistData: AlbumData[];
  artistDataCount: number;
}

export interface TagDataResult {
  tagData: AlbumData[];
  tagDataCount: number;
}

export interface SearchDataResult {
  searchData: AlbumData[];
  searchDataCount: number;
}

// params 타입
export interface Video {
  title: string;
  url: string;
}

export interface UpdatedAlbumData {
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

export interface UpdatedDataForUpdate extends UpdatedAlbumData {
  prevAlbumId: string;
}

export interface UploadDataParams {
  updatedData: UpdatedAlbumData;
}

export interface UpdateDataParams {
  updatedData: UpdatedDataForUpdate;
}
