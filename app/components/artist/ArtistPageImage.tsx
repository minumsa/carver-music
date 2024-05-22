import { AlbumInfo } from "../../modules/types";
import styles from "./ArtistPageImage.module.css";

interface ArtistPageImageProps {
  artistData: AlbumInfo[];
}

export const ArtistPageImage = ({ artistData }: ArtistPageImageProps) => {
  const firstArtistData = artistData[0];
  const { artist, artistImgUrl } = firstArtistData;

  return (
    <div className={styles.container}>
      <div className={styles.artistImageContainer}>
        <img className={styles.artistImage} src={artistImgUrl} alt={artist} loading="lazy" />
      </div>
      <div className={styles.artistName}>{artist}</div>
    </div>
  );
};
