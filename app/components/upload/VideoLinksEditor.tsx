import React from "react";
import styles from "./VideoLinksEditor.module.css";
import { Video } from "@/app/modules/types";

interface VideoLinksEditorProps {
  videos: Video[];
  videoCount: number;
  setVideoCount: React.Dispatch<React.SetStateAction<number>>;
  setVideos: React.Dispatch<React.SetStateAction<Video[]>>;
  searchKeyword: string;
  artist: string;
}

export default function VideoLinksEditor({
  videos,
  videoCount,
  setVideoCount,
  setVideos,
  searchKeyword,
  artist,
}: VideoLinksEditorProps) {
  return new Array(videoCount).fill(null).map((_, index) => {
    const copiedVideos = [...videos];
    const videoNumber = index + 1;
    const isFirstVideo = index === 0;
    return (
      <div key={index} className={styles.block_container}>
        <div className={styles.block_title}>
          {isFirstVideo ? (
            <>
              <a
                href={`https://www.youtube.com/results?search_query=${artist} ${searchKeyword} MV 자막`}
                target="_blank"
              >
                <div>{`영상 제목 ${videoNumber}`}</div>
              </a>
              <div className={styles.video_button_container}>
                <div
                  className={styles.video_button}
                  onClick={() => {
                    setVideoCount((prev) => prev + 1);
                    setVideos([...videos, { title: "", url: "" }]);
                  }}
                >
                  +
                </div>
              </div>
              <div className={styles.video_button_container}>
                <div
                  className={styles.video_button}
                  onClick={() => {
                    setVideoCount((prev) => prev - 1);
                    const copiedVideos = [...videos];
                    copiedVideos.splice(index, 1);
                    setVideos(copiedVideos);
                  }}
                >
                  −
                </div>
              </div>
            </>
          ) : (
            <>
              <div>{`영상 제목 ${videoNumber}`}</div>
              <div className={styles.video_button_container}>
                <div
                  className={styles.video_button}
                  onClick={() => {
                    setVideoCount((prev) => prev - 1);
                    const copiedVideos = [...videos];
                    copiedVideos.splice(index, 1);
                    setVideos(copiedVideos);
                  }}
                >
                  −
                </div>
              </div>
            </>
          )}
        </div>
        <input
          className={styles.input}
          value={videos[index].title}
          onChange={(e) => {
            copiedVideos[index] = { ...copiedVideos[index], title: e.target.value };
            setVideos(copiedVideos);
          }}
        />
        <div
          className={`${styles.block_title} ${styles.video_link_title}`}
        >{`영상 링크 ${videoNumber}`}</div>
        <input
          className={styles.input}
          value={videos[index].url}
          onChange={(e) => {
            copiedVideos[index] = { ...copiedVideos[index], url: e.target.value };
            setVideos(copiedVideos);
          }}
        />
      </div>
    );
  });
}
