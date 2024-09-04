import { CalendarData } from "@/app/modules/types";
import styles from "./CalendarDetailAlbumItem.module.css";
import { usePathname, useRouter } from "next/navigation";
import { toArtistPage, toPostPage } from "@/app/modules/paths";

interface CalendarDetailAlbumItemProps {
  calendarData: CalendarData;
}

export const CalendarDetailAlbumItem = ({ calendarData }: CalendarDetailAlbumItemProps) => {
  const router = useRouter();
  const pathName = usePathname();
  const { artist, artistId, album, id, imgUrl, score } = calendarData;
  const percentageScore = 100 - score * 20;

  return (
    <div key={album} className={styles.albumInfoContainer}>
      <div
        className={styles.albumArtWrapper}
        onClick={() => {
          router.push(toPostPage(pathName, id));
        }}
      >
        <img src={imgUrl} alt={album} />
      </div>
      <button
        className={styles.ellipsis}
        onClick={() => {
          router.push(toArtistPage(pathName, artistId));
        }}
      >
        {artist}
      </button>
      <button
        className={styles.ellipsis}
        onClick={() => {
          router.push(toPostPage(pathName, id));
        }}
      >
        {album}
      </button>
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
  );
};
