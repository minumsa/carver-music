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
  [key: string]: string;
}

interface Video {
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

export interface AlbumInfo {
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
}

export interface PageProps {
  params: {
    id: string;
    keyword: string;
    page: number;
    genre: string;
    tagName: string;
  };
}

export interface UpdateInfo {
  albumId: string;
  musicVideoTitle?: string;
  musicVideoUrl?: string;
}
