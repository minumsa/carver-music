"use client";

import { AlbumInfo } from "../../modules/types";
import styles from "./Post.module.css";
import { PostAlbumMetadata } from "./PostAlbumMetadata";
import { PostText } from "./PostAlbumText";

interface PostProps {
  postData: AlbumInfo;
}

export const Post = ({ postData }: PostProps) => {
  return (
    <>
      {postData && (
        <section className={styles["container"]}>
          <PostAlbumMetadata postData={postData} />
          <PostText postData={postData} />
        </section>
      )}
    </>
  );
};
