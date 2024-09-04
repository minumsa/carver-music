import { usePathname } from "next/navigation";
import { getFormattedDuration, isAdminPage } from "../../../modules/utils";
import styles from "./AlbumPanel.module.css";
import { useRef } from "react";
import { DeleteButton } from "../assets/DeleteButton";
import { EditButton } from "../assets/EditButton";
import Link from "next/link";
import { BlurImg } from "../BlurImg";
import { AlbumData } from "../../../modules/types";
import { toArtistPage, toTagPage, toPostPage, toGenrePage } from "../../../modules/paths";
import { DEFAULT_TAGS } from "../../../modules/constants/tags";
import { GENRES } from "@/app/modules/constants/genres";

interface AlbumProps {
  albumData: AlbumData;
}

export const AlbumPanel = ({ albumData }: AlbumProps) => {
  const {
    album,
    artist,
    artistId,
    artistImgUrl,
    blurHash,
    duration,
    genre,
    id,
    imgUrl,
    markdown,
    releaseDate,
    score,
    tagKeys,
    text,
    tracks,
  } = albumData;
  const pathName = usePathname();
  const albumDuration = getFormattedDuration(duration);
  const divRef = useRef<HTMLDivElement>(null);
  const paragraphs = text.split("\n");
  const markdownFirstParagraph = markdown?.split("\n")[0];
  const genreTag = `#${GENRES[genre]}`;

  return (
    <>
      <Link className={styles.albumArtWrapper} href={toPostPage(pathName, id)}>
        <BlurImg className={styles.albumArt} blurHash={blurHash} src={imgUrl} punch={1} />
      </Link>
      <div className={styles.albumMetadataContainer}>
        {paragraphs.map((text, index) => {
          const isFirstParagraph = index === 0;
          const percentageScore = 100 - score * 20;
          if (isFirstParagraph)
            return (
              <div key={index}>
                {/* 앨범 타이틀 */}
                <div className={styles.albumTitleContainer}>
                  <Link href={toPostPage(pathName, id)}>
                    <h2 className={styles.albumTitle}>{album}</h2>
                  </Link>
                  {/* 별점 */}
                  {/* FIXME: 별 이미지 svg 파일로 교체 */}
                  <div className={styles.starContainer}>
                    <img
                      className={styles.coloredStar}
                      src="/images/coloredStar.webp"
                      alt="colored-star"
                      style={
                        score
                          ? {
                              clipPath: `inset(0 ${percentageScore}% 0 0)`,
                            }
                          : undefined
                      }
                      loading="lazy"
                    />
                    <img
                      className={styles.monoStar}
                      src="/images/monoStar.webp"
                      alt="monoStar"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className={styles.metadataPreview}>
                  {/* 아티스트 이미지 */}
                  <Link
                    className={styles.artistImageContainer}
                    href={toArtistPage(pathName, artistId)}
                  >
                    <img
                      src={artistImgUrl}
                      alt={artist}
                      className={styles.artistImage}
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
                <div className={styles.textContainer}>
                  <p ref={divRef} className={`${styles.text} ${styles.blurEnd}`}>
                    {text ? text : markdownFirstParagraph}
                  </p>
                  <Link href={toPostPage(pathName, id)}>
                    <div className={styles.moreButton}>더 보기</div>
                  </Link>
                </div>
                {/* 앨범 태그 */}
                <div className={styles.tagContainer}>
                  {genre && (
                    <Link href={toGenrePage(pathName, genre)} className={styles.tagItem}>
                      {genreTag}
                    </Link>
                  )}
                  {tagKeys.map((key: string, index: number) => {
                    return (
                      <Link href={toTagPage(pathName, key)} key={index} className={styles.tagItem}>
                        {DEFAULT_TAGS[key]}
                      </Link>
                    );
                  })}
                </div>
                {/* 관리자 페이지 - 수정 및 삭제 버튼 */}
                {isAdminPage(pathName) && (
                  <div className={styles.buttonContainer}>
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
