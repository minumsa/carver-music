import { Tags } from "../types";

export const DEFAULT_TAGS: Tags = {
  // 연도별
  decade2020s: "#2020년대",
  decade2010s: "#2010년대",
  decade2000s: "#2000년대",
  decade1990s: "#1990년대",
  decade1980s: "#1980년대",
  decade1970s: "#1970년대",
  decade1960s: "#1960년대",
  decade1950s: "#1950년대",
  decade1940s: "#1940년대",

  // 계절
  spring: "#봄 🌸",
  summer: "#여름 🏄‍♂️",
  fall: "#가을 🍂",
  winter: "#겨울 ☃️",

  // 상황
  workout: "#운동 🏋🏻‍♂️",
  dancing: "#춤 🕺",
  cleaning: "#청소 🧹",
  walking: "#산책 🚶",
  writing: "#글쓰기 ✍🏻",
  reading: "#독서 📚",
  coding: "#코딩 👨‍💻",
  shower: "#샤워 🛀",
  drink: "#술 🥃",
  sleeping: "#잠들기 전 😴",
  raining: "#비 오는 날 🌧️",

  // 감정
  love: "#사랑 ❤️",
  happy: "#기분 좋아지는 😌",
  energy: "#에너지 업 ⚡️",
  sad: "#슬픔 😢",
  relaxing: "#휴식 🌴",

  // 앨범 스타일
  diva: "#디바 🫅",
  idol: "#아이돌 🐰",
  instrumental: "#가사 없음 🎻",
  goodLyrics: "#좋은 가사 📝",
  citypop: "#시티팝 🌃",
  christmas: "#크리스마스 🎅",

  // 수상 기록
  grammyAwards: "#그래미 수상 🏆",
  koreanMusicAwards: "#한국대중음악상 수상 🏆",
  koreanTop100Albums: "#한국대중음악 100대 명반 💿",
  rollingStonesTop500Albums: "#롤링스톤 500대 명반 👅",
  rollingStonesTop100AlbumsJapan: "#롤링스톤 재팬 100대 명반 👅",
  appleMusic100Albums: "#애플뮤직 100대 명반 🍎",
};

export const LANDING_PAGE_TAGS: Tags = {
  ...DEFAULT_TAGS,
  "": "모두 보기",
};

interface GroupTags {
  [groupName: string]: {
    [tagName: string]: string;
  };
}

export const UPLOAD_PAGE_GROUP_TAGS: GroupTags = {
  연대: {
    decade2020s: "#2020년대",
    decade2010s: "#2010년대",
    decade2000s: "#2000년대",
    decade1990s: "#1990년대",
    decade1980s: "#1980년대",
    decade1970s: "#1970년대",
    decade1960s: "#1960년대",
    decade1950s: "#1950년대",
    decade1940s: "#1940년대",
  },

  계절: {
    spring: "#봄 🌸",
    summer: "#여름 🏄‍♂️",
    fall: "#가을 🍂",
    winter: "#겨울 ☃️",
  },

  상황: {
    workout: "#운동 🏋🏻‍♂️",
    dancing: "#춤 🕺",
    cleaning: "#청소 🧹",
    walking: "#산책 🚶",
    writing: "#글쓰기 ✍🏻",
    reading: "#독서 📚",
    coding: "#코딩 👨‍💻",
    shower: "#샤워 🛀",
    drink: "#술 🥃",
    sleeping: "#잠들기 전 😴",
    raining: "#비 오는 날 🌧️",
  },

  감정: {
    love: "#사랑 ❤️",
    happy: "#기분 좋아지는 😌",
    energy: "#에너지 업 ⚡️",
    sad: "#슬픔 😢",
    relaxing: "#휴식 🌴",
  },

  스타일: {
    citypop: "#시티팝 🌃",
    idol: "#아이돌 🐰",
    instrumental: "#가사 없음 🎻",
    goodLyrics: "#좋은 가사 📝",
    diva: "#디바 🫅",
    christmas: "#크리스마스 🎅",
  },

  수상: {
    grammyAwards: "#그래미 수상 🏆",
    koreanMusicAwards: "#한국대중음악상 수상 🏆",
    koreanTop100Albums: "#한국대중음악 100대 명반 💿",
    rollingStonesTop500Albums: "#롤링스톤 500대 명반 👅",
    rollingStonesTop100AlbumsJapan: "#롤링스톤 재팬 100대 명반 👅",
    appleMusic100Albums: "#애플뮤직 100대 명반 🍎",
  },

  모두보기: {
    "": "모두 보기",
  },
};
