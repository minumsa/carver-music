import { AlbumInfo } from "../../modules/types";
import styles from "./Post.module.css";
import { PostAlbumMetadata } from "./PostAlbumMetadata";
import { PostText } from "./PostAlbumText";

interface AlbumProps {
  albumData: AlbumInfo;
}

export const PostAlbum = ({ albumData }: AlbumProps) => {
  return (
    <section className={styles["album-container"]}>
      <PostAlbumMetadata postData={albumData} />
      <PostText postData={albumData} />
    </section>
  );
};
