import { toast } from "react-toastify";
import { AlbumError } from "../errors";

export async function handleAlbumApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = AlbumError.fromResponse(response);
    toast.error(error.message);
    throw error;
  }
  return response.json();
}

export function handleAlbumApiError(error: unknown): void {
  if (error instanceof AlbumError) {
    toast.error(error.message);
  } else {
    const systemErrorMessage = "앨범 데이터 처리 중 시스템 오류가 발생했습니다.";
    toast.error(systemErrorMessage);
    throw new Error(systemErrorMessage);
  }
}
