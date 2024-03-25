import { AlbumInfo } from "../../modules/types";
import styles from "./ArtistPageImage.module.css";

interface ArtistPageImageProps {
  artistData: AlbumInfo[];
}

export const ArtistPageImage = ({ artistData }: ArtistPageImageProps) => {
  const firstArtistData = artistData[0];
  const { artist, artistImgUrl } = firstArtistData;

  return (
    <div className={styles["container"]}>
      <div className={styles["artist-image-container"]}>
        <img className={styles["artist-image"]} src={artistImgUrl} alt={artist} loading="lazy" />
      </div>
      <div className={styles["artist-name"]}>{artist}</div>
    </div>
  );
};
