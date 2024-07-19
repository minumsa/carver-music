import { usePathname } from "next/navigation";
import styles from "./PostMetadata.module.css";
import { formatDate, getFormattedDuration, isAdminPage } from "../../modules/utils";
import { DeleteButton } from "../@common/assets/DeleteButton";
import { EditButton } from "../@common/assets/EditButton";
import Link from "next/link";
import { LinkIcon } from "../@common/assets/LinkIcon";
import { BlurImg } from "../@common/BlurImg";
import { AlbumInfo } from "../../modules/types";

interface PostMetadataProps {
  postData: AlbumInfo;
}

export const PostMetadata = ({ postData }: PostMetadataProps) => {
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
  const albumDuration = getFormattedDuration(duration);
  const pathName = usePathname();
  const hasVideo = videos[0]?.title.length > 0;

  return (
    <header className={styles.container}>
      {/* 앨범아트 관련 코드 */}
      <div className={styles.albumImageContainer}>
        <a href={link} target="_blank">
          <BlurImg className={styles.albumImage} blurHash={blurHash} src={imgUrl} punch={1} />
        </a>
      </div>
      <div className={styles.metadataContainer}>
        {/* 아티스트 정보 */}
        <label className={styles.metadataTitle}>아티스트</label>
        <Link
          href={isAdminPage(pathName) ? `/admin/artist/${artistId}/1` : `/artist/${artistId}/1`}
        >
          {artist}
        </Link>
        <LinkIcon />

        {/* 앨범 정보 */}
        <label className={styles.metadataTitle}>앨범</label>
        <div>{album}</div>

        {/* 레이블 정보 */}
        <label className={styles.metadataTitle}>레이블</label>
        <div>{label}</div>

        {/* 발매일 정보 */}
        <label className={styles.metadataTitle}>발매일</label>
        <div>{formatDate(releaseDate)}</div>

        {/* 러닝타임 정보 */}
        <label className={styles.metadataTitle}>러닝타임</label>
        <div>
          {albumDuration}, {tracks}곡
        </div>

        {/* 비디오 정보 */}
        {hasVideo && (
          <>
            <label className={styles.metadataTitle}>비디오</label>
            {postData.videos.map((video) => {
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
        <label className={styles.metadataTitle}>스트리밍</label>
        <div className={styles.streamingIconContainer}>
          <a href={link} target="_blank">
            <img src="/svgs/apple.svg" alt="link-icon" className={styles.appleIcon}></img>
          </a>
          <a href={`https://open.spotify.com/album/${id}`} target="_blank">
            <img src="/svgs/spotify.svg" alt="link-icon" className={styles.spotifyIcon}></img>
          </a>
        </div>

        {/* 관리자 페이지 정보 */}
        {isAdminPage(pathName) && (
          <div className={styles.adminButtonContainer}>
            <EditButton data={postData} />
            <DeleteButton data={postData} />
          </div>
        )}
      </div>
    </header>
  );
};
