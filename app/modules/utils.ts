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

export const getYearMonthFromStr = (date: string) => {
  const newDate = new Date(date);
  const year = newDate.getFullYear();
  const month = newDate.getMonth() + 1;
  const day = newDate.getDate();
  return { year, month, day };
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

// 간단한 이메일 형식 검증 정규식
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 비밀번호는 최소 10자 이상이어야 하고, 특수문자를 포함해야 함
export const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[a-zA-Z])(?=.*\d).{10,}$/;
  return passwordRegex.test(password);
};

// userName은 영어 대소문자, 한글, 숫자만 허용하고 최소 2자, 최대 10자
export const validateUserName = (userName: string): boolean => {
  const userNameRegex = /^[a-zA-Z0-9가-힣]{2,10}$/;
  return userNameRegex.test(userName);
};

// userId는 영어 소문자와 숫자만 허용하고 최소 3자, 최대 15자
export const validateUserId = (userId: string): boolean => {
  const userIdRegex = /^[a-z0-9]{3,15}$/;
  return userIdRegex.test(userId);
};

export const formatTimeDifference = (date: Date): string => {
  const currentDate = new Date();
  const differenceInMilliseconds = currentDate.getTime() - new Date(date).getTime();
  const differenceInMinutes = differenceInMilliseconds / (1000 * 60);
  const differenceInHours = differenceInMinutes / 60;
  const differenceInDays = differenceInHours / 24;

  if (differenceInMinutes < 1) {
    return `방금 전`;
  } else if (differenceInMinutes < 60) {
    return `${Math.floor(differenceInMinutes)}분 전`;
  } else if (differenceInHours < 24) {
    return `${Math.floor(differenceInHours)}시간 전`;
  } else {
    return `${Math.floor(differenceInDays)}일 전`;
  }
};

export const ACTIVE_TAG_STYLES = (isActiveTag: boolean, pathName: string) =>
  isActiveTag
    ? { boxShadow: "inset 0 0 0 1px var(--text-color)", order: isLandingPage(pathName) ? -1 : 0 }
    : undefined;
