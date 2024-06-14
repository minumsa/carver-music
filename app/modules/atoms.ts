import { atom } from "jotai";
import { AlbumInfo } from "./types";

export const scrollCountAtom = atom<number>(1);
export const isScrollingAtom = atom<boolean>(false);
export const scrollPositionAtom = atom<number>(0);
export const totalScrollCountAtom = atom<number>(0);
export const albumDataAtom = atom<AlbumInfo[]>([]);
export const tagAtom = atom<string>("");
export const isFirstFetchAtom = atom<boolean>(true);
export const showAllTagItemsAtom = atom<boolean>(false);
