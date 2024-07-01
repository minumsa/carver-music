import { encode } from "blurhash";

export const isAdminPage = (pathName: string) => {
  return pathName.includes("admin");
};

export const isUploadPage = (pathName: string) => {
  return pathName.includes("upload");
};

export const isLandingPage = (pathName: string) => {
  return pathName === "/" || pathName === "/admin";
};

export const isSearchPage = (pathName: string) => {
  return pathName.includes("search");
};

export const getFormattedDuration = (seconds: number) => {
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

export const getDecade = (releaseDate: string) => {
  const formattedDate = new Date(releaseDate);
  const formattedReleaseYear = Math.floor(formattedDate.getFullYear() / 10) * 10;
  return `decade${formattedReleaseYear}s`;
};

export const getBlurhash = (imgUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    let blurhash = "";
    const imageElement = new Image();
    imageElement.crossOrigin = "anonymous"; // cross-origin 자격 증명 없이 요청
    imageElement.src = imgUrl;

    imageElement.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = imageElement.width;
      canvas.height = imageElement.height;
      const context = canvas.getContext("2d");

      if (context) {
        context.drawImage(imageElement, 0, 0);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        blurhash = encode(imageData.data, imageData.width, imageData.height, 4, 4);
        resolve(blurhash); // 성공 시 Blurhash 값을 반환
      } else {
        reject(new Error("Failed to get canvas context"));
      }
    };

    imageElement.onerror = (err) => {
      reject(err); // 이미지 로드 실패 시 에러 반환
    };
  });
};

export const getYearMonthFromStr = (yearMonth: string) => {
  const year = Number(yearMonth.slice(0, 4));
  const month = Number(yearMonth.slice(4));
  return { year, month };
};

export const getTodaysYearMonth = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  return { year, month };
};

export const getYearMonthFromDate = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return { year, month };
};
