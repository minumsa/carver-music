import { usePathname } from "next/navigation";
import styles from "./PostAlbumMetadata.module.css";
import { formatDate, getFormattedDuration, isAdminPage } from "../../modules/utils";
import { DeleteButton } from "../@common/assets/DeleteButton";
import { EditButton } from "../@common/assets/EditButton";
import Link from "next/link";
import { LinkIcon } from "../@common/assets/LinkIcon";
import { BlurImg } from "../@common/BlurImg";
import { AlbumInfo } from "../../modules/types";
import { AlbumArtCard } from "./AlbumArtCard";
import { isBrowser } from "react-device-detect";
import { useEffect, useState } from "react";

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
  const albumDuration = getFormattedDuration(duration);
  const pathName = usePathname();
  const hasVideo = videos[0]?.title.length > 0;
  const [browserView, setBrowserView] = useState(false);

  useEffect(() => {
    isBrowser && setBrowserView(true);
  }, []);

  return (
    <header className={styles.container}>
      {/* 앨범아트 관련 코드 */}
      {browserView ? (
        <AlbumArtCard link={link} imgUrl={imgUrl} />
      ) : (
        <div className={styles.albumImageContainer}>
          <a href={link} target="_blank">
            <BlurImg className={styles.albumImage} blurHash={blurHash} src={imgUrl} punch={1} />
          </a>
        </div>
      )}

      <div className={styles.metadataContainer}>
        {/* 아티스트 정보 */}
        <div className={styles.metadataTitle}>아티스트</div>
        <Link
          href={isAdminPage(pathName) ? `/admin/artist/${artistId}/1` : `/artist/${artistId}/1`}
        >
          {artist}
        </Link>
        <LinkIcon />

        {/* 앨범 정보 */}
        <div className={styles.metadataTitle}>앨범</div>
        <div>{album}</div>

        {/* 레이블 정보 */}
        <div className={styles.metadataTitle}>레이블</div>
        <div>{label}</div>

        {/* 발매일 정보 */}
        <div className={styles.metadataTitle}>발매일</div>
        <div>{formatDate(releaseDate)}</div>

        {/* 러닝타임 정보 */}
        <div className={styles.metadataTitle}>러닝타임</div>
        <div>
          {albumDuration}, {tracks}곡
        </div>

        {/* 비디오 정보 */}
        {hasVideo && (
          <>
            <div className={styles.metadataTitle}>비디오</div>
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
        <div className={styles.metadataTitle}>스트리밍</div>
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
