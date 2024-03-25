import { usePathname } from "next/navigation";
import styles from "./PostAlbumMetadata.module.css";
import { formatDate, formatDuration, isAdminPage } from "../../modules/utils";
import { DeleteButton } from "./assets/DeleteButton";
import { EditButton } from "./assets/EditButton";
import Link from "next/link";
import { LinkIcon } from "./assets/LinkIcon";
import { BlurImg } from "../@common/BlurImage";
import { AlbumInfo } from "../../modules/types";

interface PostAlbumMetadataProps {
  postData: AlbumInfo;
}

export const PostAlbumMetadata = ({ postData }: PostAlbumMetadataProps) => {
  const {
    id,
    videos,
    duration,
    releaseDate,
    link,
    blurHash,
    imgUrl,
    album,
    artist,
    artistId,
    label,
    tracks,
  } = postData;
  const albumDuration = formatDuration(duration);
  const pathName = usePathname();
  const hasVideo = videos[0]?.title.length > 0;

  return (
    <header className={styles["container"]}>
      {/* 이미지 관련 코드 */}
      <div className={styles["album-image-container"]}>
        <a href={link} target="_blank">
          <BlurImg className={styles["album-image"]} blurHash={blurHash} src={imgUrl} punch={1} />
        </a>
      </div>

      <div className={styles["metadata-container"]}>
        {/* 아티스트 정보 */}
        <div className={styles["metadata-title"]}>아티스트</div>
        <Link
          href={isAdminPage(pathName) ? `/admin/artist/${artistId}/1` : `/artist/${artistId}/1`}
        >
          {artist}
        </Link>
        <LinkIcon />

        {/* 앨범 정보 */}
        <div className={styles["metadata-title"]}>앨범</div>
        <div>{album}</div>

        {/* 레이블 정보 */}
        <div className={styles["metadata-title"]}>레이블</div>
        <div>{label}</div>

        {/* 발매일 정보 */}
        <div className={styles["metadata-title"]}>발매일</div>
        <div>{formatDate(releaseDate)}</div>

        {/* 러닝타임 정보 */}
        <div className={styles["metadata-title"]}>러닝타임</div>
        <div>
          {albumDuration}, {tracks}곡
        </div>

        {/* 비디오 정보 */}
        {hasVideo && (
          <>
            <div className={styles["metadata-title"]}>비디오</div>
            {postData.videos.map(video => {
              const { title, url } = video;
              return (
                <div key={title}>
                  <a href={url} target="_blank">
                    {title}
                  </a>
                  <LinkIcon />
                </div>
              );
            })}
          </>
        )}

        {/* 스트리밍 정보 */}
        <div className={styles["metadata-title"]}>스트리밍</div>
        <div className={styles["streaming-icon-container"]}>
          <a href={link} target="_blank">
            <img src="/icons/apple.svg" alt="link-icon" className={styles["apple-icon"]}></img>
          </a>
          <a href={`https://open.spotify.com/album/${id}`} target="_blank">
            <img src="/icons/spotify.svg" alt="link-icon" className={styles["spotify-icon"]}></img>
          </a>
        </div>

        {/* 관리자 페이지 정보 */}
        {isAdminPage(pathName) && (
          <div className={styles["admin-button-container"]}>
            <EditButton data={postData} />
            <DeleteButton data={postData} />
          </div>
        )}
      </div>
    </header>
  );
};
