import { atom } from "jotai";
import { AlbumDataLandingPage, CalendarData, Comment, Reply } from "./types";

// 앨범 데이터 관련
export const scrollCountAtom = atom<number>(1);
export const isScrollingAtom = atom<boolean>(false);
export const scrollPositionAtom = atom<number>(0);
export const totalScrollCountAtom = atom<number>(0);
export const albumDataAtom = atom<AlbumDataLandingPage[]>([]);
export const tagAtom = atom<string>("");
export const showAllTagItemsAtom = atom<boolean>(false);
export const activeDateAtom = atom<Date>(new Date());
export const activeCalendarDataAtom = atom<CalendarData[]>([]);

// 로그인 데이터 관련
export const userNameAtom = atom<string>("방문자");
export const userImageAtom = atom<string>("/svgs/ghost.svg");
export const userIdAtom = atom<string>("");

// 댓글 관련
export const commentsAtom = atom<Comment[]>([]);
export const repliesAtom = atom<Reply[]>([]);
