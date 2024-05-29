import React from "react";
import styles from "./VideoLinksEditor.module.css";
import { Video } from "@/app/modules/types";

interface VideoLinksEditorProps {
  videoCount: number;
  setVideoCount: React.Dispatch<React.SetStateAction<number>>;
  videos: Video[];
  setVideos: React.Dispatch<React.SetStateAction<Video[]>>;
}

export default function VideoLinksEditor({
  videos,
  videoCount,
  setVideoCount,
  setVideos,
}: VideoLinksEditorProps) {
  const videoTemplateArray = new Array(videoCount).fill(null);
  return (
    <div className={styles.blockContainer}>
      <label className={styles.blockTitle}>
        영상
        <div className={styles.videoButtonContainer}>
          <div
            className={styles.videoButton}
            onClick={() => {
              setVideoCount((prev) => prev + 1);
              setVideos([...videos, { title: "", url: "" }]);
            }}
          >
            +
          </div>
        </div>
      </label>
      {videoTemplateArray.map((_, index) => {
        const copiedVideos = [...videos];
        const videoNumber = index + 1;
        return (
          <div key={index} className={styles.blockWrapper}>
            <div className={styles.blockTitle}>
              <>
                <div>{`제목 ${videoNumber}`}</div>
                <div className={styles.videoButtonContainer}>
                  <div
                    className={styles.videoButton}
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
            </div>
            <input
              className={styles.input}
              value={videos[index].title}
              onChange={(e) => {
                copiedVideos[index] = { ...copiedVideos[index], title: e.target.value };
                setVideos(copiedVideos);
              }}
            />
            <div className={styles.blockTitle}>{`링크 ${videoNumber}`}</div>
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
      })}
    </div>
  );
}
