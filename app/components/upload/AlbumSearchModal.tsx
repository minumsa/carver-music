import { SearchData } from "@/app/modules/types";
import styles from "./AlbumSearchModal.module.css";

interface SearchResultProps {
  searchKeyword: string;
  searchData: SearchData[];
  onSelect: (data: SearchData) => void;
}

export const AlbumSearchModal = ({ searchKeyword, searchData, onSelect }: SearchResultProps) => {
  const hasSearchData = searchData.length > 0;

  return (
    <div className={styles.container}>
      {hasSearchData ? (
        searchData.map((data, index: number) => {
          const { artists, name, release_date, images } = data;
          const artist = artists[0].name;
          const album = name;
          const releaseYear = release_date.slice(0, 4);
          const imgUrl = images[2].url;
          return (
            <div
              className={styles.modalWrapper}
              key={index}
              onClick={() => {
                onSelect(data);
              }}
            >
              <div className={styles.albumImageWrapper}>
                <img className={styles.albumImage} src={imgUrl} alt="album_image" loading="lazy" />
              </div>
              <div className={styles.albumMetadataWrapper}>
                <div>
                  <span className={styles.albumTitle}>{album}</span>
                  <span className={styles.releaseYear}>({releaseYear})</span>
                </div>
                <div>{artist}</div>
              </div>
            </div>
          );
        })
      ) : (
        <div
          className={styles.errorText}
        >{`"${searchKeyword}" 키워드와 일치하는 데이터가 없습니다.`}</div>
      )}
    </div>
  );
};
