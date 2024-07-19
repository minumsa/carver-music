"use client";

import { AlbumInfo } from "../../modules/types";
import styles from "./PostContents.module.css";
import { PostMetadata } from "./PostMetadata";
import dynamic from "next/dynamic";

interface PostProps {
  postData: AlbumInfo;
}

const PostTextNoSSR = dynamic(() => import("./PostText").then((mod) => mod.PostText), {
  ssr: false,
});

export const PostContents = ({ postData }: PostProps) => {
  return (
    <>
      {postData && (
        <section className={styles.container}>
          <PostMetadata postData={postData} />
          <PostTextNoSSR postData={postData} />
        </section>
      )}
    </>
  );
};
