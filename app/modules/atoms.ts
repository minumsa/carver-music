import { atom } from "jotai";
import { AlbumInfoLandingPage, CalendarData } from "./types";

// 앨범 데이터 관련
export const scrollCountAtom = atom<number>(1);
export const isScrollingAtom = atom<boolean>(false);
export const scrollPositionAtom = atom<number>(0);
export const totalScrollCountAtom = atom<number>(0);
export const albumDataAtom = atom<AlbumInfoLandingPage[]>([]);
export const tagAtom = atom<string>("");
export const showAllTagItemsAtom = atom<boolean>(false);
export const activeDateAtom = atom<Date>(new Date());
export const activeCalendarDataAtom = atom<CalendarData[]>([]);

// 로그인 데이터 관련
export const userNameAtom = atom<string>("방문자");
export const userImageAtom = atom<string>("/svgs/ghost.svg");
export const userIdAtom = atom<string>("");
