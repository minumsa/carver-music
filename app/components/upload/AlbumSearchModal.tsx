import { SearchData } from "@/app/modules/types";
import styles from "./AlbumSearchModal.module.css";

interface SearchResultProps {
  searchData: SearchData[];
  onSelect: (data: SearchData) => void;
}

export const AlbumSearchModal = ({ searchData, onSelect }: SearchResultProps) => {
  return (
    <div className={styles.container} style={{ display: searchData ? "flex" : "none" }}>
      {searchData.map((data, index: number) => {
        const { artists, name, release_date, images } = data;
        const artist = artists[0].name;
        const album = name;
        const releaseYear = release_date.slice(0, 4);
        const imgUrl = images[2].url;
        return (
          <div
            className={styles.modal_wrapper}
            key={index}
            onClick={() => {
              onSelect(data);
            }}
          >
            <div className={styles.album_image_wrapper}>
              <img className={styles.album_image} src={imgUrl} alt="album_image" loading="lazy" />
            </div>
            <div className={styles.album_metadata_wrapper}>
              <div>
                <span className={styles.album_title}>{album}</span>
                <span className={styles.release_year}>({releaseYear})</span>
              </div>
              <div>{artist}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
