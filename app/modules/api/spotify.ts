import { toast } from "react-toastify";
import { SpotifyError } from "../errors";

export const fetchSpotify = async (albumId: string) => {
  if (!albumId) {
    alert("모든 항목을 채워주세요.");
    return;
  }

  try {
    const queryString = `?albumId=${albumId}`;
    const url = `/api/spotify/fetch${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = SpotifyError.fromResponse(response);
      toast.error(error.message);
      throw error;
    }

    const fetchedData = await response.json();
    return fetchedData;
  } catch (error) {
    if (!(error instanceof SpotifyError)) {
      const systemErrorMessage = "스포티파이 데이터 처리 중 시스템 오류가 발생했습니다.";
      toast.error(systemErrorMessage);
      throw new Error(systemErrorMessage);
    }
    throw error;
  }
};

export const searchSpotify = async (searchKeyword: string) => {
  try {
    const queryString = `?searchKeyword=${searchKeyword}`;
    const url = `/api/spotify/search${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = SpotifyError.fromResponse(response);
      toast.error(error.message);
      throw error;
    }

    const searchData = await response.json();
    return searchData;
  } catch (error) {
    if (!(error instanceof SpotifyError)) {
      const systemErrorMessage = "스포티파이 데이터 처리 중 시스템 오류가 발생했습니다.";
      toast.error(systemErrorMessage);
      throw new Error(systemErrorMessage);
    }
    throw error;
  }
};
