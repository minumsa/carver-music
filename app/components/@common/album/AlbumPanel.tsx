import { usePathname } from "next/navigation";
import { formatDuration, isAdminPage } from "../../../modules/utils";
import styles from "./AlbumPanel.module.css";
import { isMobile } from "react-device-detect";
import { useRef } from "react";
import { DeleteButton } from "../../post/assets/DeleteButton";
import { EditButton } from "../../post/assets/EditButton";
import Link from "next/link";
import { BlurImg } from "../BlurImg";
import { AlbumInfo } from "../../../modules/types";
import { toArtistPage, toTagPage, toPostPage } from "../../../modules/paths";
import { DEFAULT_TAGS } from "../../../modules/constants";

interface AlbumProps {
  albumData: AlbumInfo;
}

export const AlbumPanel = ({ albumData }: AlbumProps) => {
  const {
    id,
    album,
    artist,
    artistId,
    artistImgUrl,
    tracks,
    releaseDate,
    text,
    blurHash,
    duration,
    imgUrl,
    tagKeys,
    score,
  } = albumData;
  const pathName = usePathname();
  const albumDuration = formatDuration(duration);
  const divRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Link className={styles["album-image-container"]} href={toPostPage(pathName, id)}>
        <BlurImg className={styles["album-image"]} blurHash={blurHash} src={imgUrl} punch={1} />
      </Link>
      <div className={styles["album-metadata-container"]}>
        {text.split("\n").map((text, index) => {
          const longTextStandard = isMobile ? 100 : 180;
          const isFirstParagraph = index === 0;
          const isLongText = text.length > longTextStandard;
          if (isFirstParagraph)
            return (
              <div key={index}>
                {/* 앨범 타이틀 */}
                <div className={styles["album-title"]}>
                  <Link href={toPostPage(pathName, id)}>
                    <h2>{album}</h2>
                  </Link>
                  {/* 별점 */}
                  <div className={styles["star-container"]}>
                    <img
                      className={styles["colored-star"]}
                      src="/icons/star-color.webp"
                      alt="colored-star"
                      style={
                        score
                          ? {
                              clipPath: `inset(0 ${100 - score * 20}% 0 0)`,
                            }
                          : undefined
                      }
                      loading="lazy"
                    />
                    <img
                      className={styles["mono-star"]}
                      src="/icons/star-mono.webp"
                      alt="mono-star"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className={styles["metadata-preview"]}>
                  {/* 아티스트 이미지 */}
                  <Link
                    className={styles["artist-image-container"]}
                    href={toArtistPage(pathName, artistId)}
                  >
                    <img
                      src={artistImgUrl}
                      alt={artist}
                      className={styles["artist-image"]}
                      loading="lazy"
                    />
                  </Link>
                  <div>
                    {/* 아티스트 이름 */}
                    <Link href={toArtistPage(pathName, artistId)}>{artist}</Link>
                    {/* 발매일, 트랙 개수, 러닝타임 */}
                    <span>{` • ${releaseDate.slice(0, 4)} • ${tracks}곡, ${albumDuration}`}</span>
                  </div>
                </div>
                {/* 텍스트 미리보기 및 더 보기 링크 */}
                <div className={styles["text-container"]}>
                  <p
                    ref={divRef}
                    className={`${styles["text"]} ${isLongText ? styles["blur-end"] : undefined}`}
                  >
                    {text}
                  </p>
                  {isLongText && (
                    <Link href={toPostPage(pathName, id)}>
                      <div className={styles["more-button"]}>더 보기</div>
                    </Link>
                  )}
                </div>
                {/* 앨범 태그 */}
                <div className={styles["tag-container"]}>
                  {tagKeys.map((tagKey: string, index: number) => {
                    return (
                      <Link
                        href={toTagPage(pathName, tagKey)}
                        key={index}
                        className={styles["tag-item"]}
                      >
                        {DEFAULT_TAGS[tagKey]}
                      </Link>
                    );
                  })}
                </div>
                {/* 관리자 페이지 - 수정 및 삭제 버튼 */}
                {isAdminPage(pathName) && (
                  <div className={styles["admin-button-container"]}>
                    <EditButton data={albumData} />
                    <DeleteButton data={albumData} />
                  </div>
                )}
              </div>
            );
        })}
      </div>
    </>
  );
};
