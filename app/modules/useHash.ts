import { useEffect, useState } from "react";
import { decode } from "blurhash";

export function useBlurhash(
  blurhash: string,
  width: number,
  height: number,
  punch?: number
): string | null {
  punch = punch || 1;

  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;
    width = 100;
    height = 100;
    if (!blurhash || !width || !height) return;

    // decode hash
    const pixels = decode(blurhash, width, height, punch);
    // temporary canvas to create a blob from decoded ImageData
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (context) {
      const imageData = context.createImageData(width, height);
      imageData.data.set(pixels);
      context.putImageData(imageData, 0, 0);
      canvas.toBlob(blob => {
        if (!isCancelled && blob) {
          setUrl(oldUrl => {
            if (oldUrl) {
              URL.revokeObjectURL(oldUrl);
            }
            return URL.createObjectURL(blob);
          });
        }
      });
    }

    return function cleanupBlurhash() {
      isCancelled = true;
      setUrl(oldUrl => {
        if (oldUrl) {
          URL.revokeObjectURL(oldUrl);
        }
        return null;
      });
    };
  }, [blurhash, height, width, punch]);

  return url;
}
