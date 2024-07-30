import { AlbumData } from "../../modules/types";
import styles from "./ArtistHeader.module.css";

interface ArtistPageImageProps {
  artistData: AlbumData[];
}

export const ArtistHeader = ({ artistData }: ArtistPageImageProps) => {
  const [firstArtistData] = artistData;
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
