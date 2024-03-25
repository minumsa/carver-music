import { atom } from "jotai";
import { AlbumInfo } from "./types";

export const scrollCountAtom = atom<number>(1);
export const scrollPositionAtom = atom<number>(0);
export const currentTotalScrollCountAtom = atom<number>(0);
export const albumDataAtom = atom<AlbumInfo[]>([]);
export const CurrentTagKeyAtom = atom<string>("");
