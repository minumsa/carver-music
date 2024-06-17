"use client";

import { AlbumInfo } from "../../modules/types";
import styles from "./PostContents.module.css";
import { PostAlbumMetadata } from "./PostAlbumMetadata";
import { PostText } from "./PostAlbumText";

interface PostProps {
  postData: AlbumInfo;
}

export const PostContents = ({ postData }: PostProps) => {
  return (
    <>
      {postData && (
        <section className={styles.container}>
          <PostAlbumMetadata postData={postData} />
          <PostText postData={postData} />
        </section>
      )}
    </>
  );
};
