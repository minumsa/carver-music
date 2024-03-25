const isAdmin = (pathName: string) => {
  return pathName.includes("admin");
};

export const toPostPage = (pathName: string, albumId: string) =>
  isAdmin(pathName) ? `/admin/post/${albumId}` : `/post/${albumId}`;

export const toArtistPage = (pathName: string, artistId: string) =>
  isAdmin(pathName) ? `/admin/artist/${artistId}/1` : `/artist/${artistId}/1`;

export const toTagPage = (pathName: string, tagKey: string) =>
  isAdmin(pathName) ? `/admin/search/tag/${tagKey}/1` : `/search/tag/${tagKey}/1`;

export const toGenrePage = (pathName: string, category: string) =>
  isAdmin(pathName) ? `admin/${category}/1` : `${category}/1`;

export const toSearchPage = (pathName: string) => (isAdmin(pathName) ? `admin/search` : `search`);
