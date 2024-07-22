import { AlbumPanel } from "./AlbumPanel";
import styles from "./AlbumContents.module.css";
import { AlbumInfo } from "../../../modules/types";
import { SUB_PER_PAGE_COUNT } from "@/app/modules/config";

interface AlbumContentsProps {
  albumData: AlbumInfo[];
}

export const AlbumContents = ({ albumData }: AlbumContentsProps) => {
  return albumData.map((item, index) => {
    const isLastItem = index === albumData.length - 1;
    const isLastItemInPage = (index + 1) % SUB_PER_PAGE_COUNT === 0;

    return (
      <article
        key={index}
        className={styles.container}
        style={
          isLastItemInPage || isLastItem
            ? undefined
            : { borderBottom: "1px solid var(--border-color)" }
        }
      >
        <AlbumPanel albumData={item} />
      </article>
    );
  });
};
