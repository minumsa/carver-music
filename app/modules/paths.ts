import { isAdminPage } from "./utils";

export const toPostPage = (pathName: string, albumId: string) =>
  isAdminPage(pathName) ? `/admin/post/${albumId}` : `/post/${albumId}`;

export const toArtistPage = (pathName: string, artistId: string) =>
  isAdminPage(pathName) ? `/admin/artist/${artistId}/1` : `/artist/${artistId}/1`;

export const toTagPage = (pathName: string, tagKey: string) =>
  isAdminPage(pathName) ? `/admin/search/tag/${tagKey}/1` : `/search/tag/${tagKey}/1`;

export const toGenrePage = (pathName: string, category: string) =>
  isAdminPage(pathName) ? `/admin/${category}/1` : `/${category}/1`;

export const toSearchPage = (pathName: string) =>
  isAdminPage(pathName) ? `/admin/search` : `/search`;
