export const isAdminPage = (pathName: string) => {
  return pathName.includes("admin");
};

export const isUploadPage = (pathName: string) => {
  return pathName.includes("upload");
};

export const isMainPage = (pathName: string) => {
  return pathName === "";
};

export const isSearchPage = (pathName: string) => {
  return pathName === "search";
};

export const formatDuration = (seconds: number) => {
  const hours = Math.floor(Math.floor(seconds / 60) / 60);
  const minutes = Math.floor(seconds / 60) % 60;

  let formattedDuration: string;
  if (hours > 0) {
    formattedDuration = `${hours}시간 ${minutes}분`;
  } else {
    formattedDuration = `${minutes}분`;
  }

  return formattedDuration;
};

export const formatDate = (date: Date | string) => {
  const newDate = new Date(date);
  return `${newDate.getFullYear()}년 ${newDate.getMonth() + 1}월 ${newDate.getDate()}일`;
};
