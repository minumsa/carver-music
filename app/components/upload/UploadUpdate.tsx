"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./UploadUpdate.module.css";
import React from "react";
import { updateData, uploadData } from "../../modules/api/album";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/esm/locale";
import "react-datepicker/dist/react-datepicker.css";
import Rate from "rc-rate";
import "rc-rate/assets/index.css";
import { AlbumData, SearchData, SpotifyAlbumData, Video } from "../../modules/types";
import { useForm } from "react-hook-form";
import { AlbumSearchModal } from "./AlbumSearchModal";
import VideoLinksEditor from "./VideoLinksEditor/VideoLinksEditor";
import { TagsEditor } from "./TagsEditor/TagsEditor";
import { getBlurhash, getDecade } from "@/app/modules/utils";
import { ToastEditorNoSSR } from "./ToastEditor/ToastEditorNoSSR";
import { Editor as ToastEditor } from "@toast-ui/react-editor";
import { useRouter } from "next/navigation";
import { fetchSpotify, searchSpotify } from "@/app/modules/api/spotify";
import { GENRES } from "@/app/modules/constants/genres";
import { UpdatedDataForUpdate } from "@/app/modules/api/albumTypes";

const TYPING_DELAY_MS = 1000;

interface UpdateProps {
  initialAlbumData?: AlbumData;
}

export interface UploadUpdateForm {
  title?: string;
  markdown?: string;
  albumId: string;
  newAlbumId: string;
  artist: string;
  artistId: string;
  genre: string;
  link: string;
  text: string;
  blurHash: string;
  searchKeyword: string;
  score: number;
  albumReleaseDate: string;
  uploadDate: Date;
  videos: Video[];
  videoCount: number;
  activeTagKeys: string[];
}

export default function UploadUpdate({ initialAlbumData }: UpdateProps) {
  const router = useRouter();
  const isUpdatePage = initialAlbumData !== undefined;
  const [searchData, setSearchData] = useState<SearchData[]>();
  const [isTyping, setIsTyping] = useState(false);
  const updatePageExclusive = { display: isUpdatePage ? undefined : "none" };
  const editorRef = useRef<ToastEditor>(null);

  const { register, handleSubmit, setValue, getValues, watch } = useForm<UploadUpdateForm>({
    defaultValues: {
      title: "",
      albumId: "",
      newAlbumId: "",
      artist: "",
      artistId: "",
      genre: "",
      link: "",
      text: "",
      blurHash: "",
      searchKeyword: "",
      score: 3,
      albumReleaseDate: "",
      uploadDate: new Date(),
      videos: [{ title: "", url: "" }],
      videoCount: 1,
      activeTagKeys: [],
      markdown: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    const {
      albumId,
      newAlbumId,
      title,
      genre,
      link,
      text,
      blurHash,
      score,
      videos,
      uploadDate,
      activeTagKeys,
    } = data;
    const filteredText = text.replace(/\[\d+\]/g, "");
    const newSpotifyAlbumData: SpotifyAlbumData | undefined = await fetchSpotify(newAlbumId);
    // 에디터 작성 내용 markdown으로 저장
    const editorIns = editorRef?.current?.getInstance();
    const markdown = editorIns?.getMarkdown();

    if (newSpotifyAlbumData) {
      const updatedData: UpdatedDataForUpdate = {
        newSpotifyAlbumData,
        title,
        prevAlbumId: albumId,
        genre,
        link,
        text: filteredText,
        uploadDate,
        score,
        videos,
        tagKeys: activeTagKeys.flat(),
        blurHash,
        markdown,
      };

      try {
        const apiMethod = isUpdatePage ? updateData : uploadData;
        const response = await apiMethod({ updatedData });
        if (response?.status === 401) {
          router.push("/login");
        }
      } catch (error) {
        console.error(`${isUpdatePage ? "updateData" : "uploadData"} 작업에 실패했습니다:`, error);
      }
    }
  });

  useEffect(() => {
    async function getAlbum() {
      if (initialAlbumData) {
        const {
          id,
          artist,
          artistId,
          genre,
          link,
          text,
          uploadDate,
          score,
          videos,
          tagKeys,
          album,
          releaseDate,
          blurHash,
          title,
          markdown,
        } = initialAlbumData;

        const decade = getDecade(releaseDate);
        const hasDecadeTag = tagKeys.includes(decade);
        const trueVideos = videos.filter((video: Video) => video.title.length > 0);
        const hasVideo = trueVideos.length > 0;

        setValue("albumId", id);
        setValue("newAlbumId", id);
        setValue("artist", artist);
        setValue("artistId", artistId);
        setValue("genre", genre);
        setValue("link", link);
        setValue("text", text);
        setValue("blurHash", blurHash);
        setValue("searchKeyword", album);
        setValue("score", score);
        setValue("uploadDate", new Date(uploadDate));
        setValue("albumReleaseDate", new Date(releaseDate).toString());
        setValue("title", title);
        setValue("markdown", markdown ? markdown : text);
        setValue("activeTagKeys", hasDecadeTag ? tagKeys : [...tagKeys, decade]);

        if (hasVideo) {
          setValue("videos", trueVideos);
          setValue("videoCount", trueVideos.length);
        }
      }
    }

    if (isUpdatePage) getAlbum();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialAlbumData]);

  const handleSearch = async () => {
    const response = await searchSpotify(watch("searchKeyword"));
    setSearchData(response);
    setIsTyping(false);
  };

  useEffect(() => {
    const isSearching = isTyping && watch("searchKeyword");
    if (isSearching) {
      const typingTimer = setTimeout(() => {
        handleSearch();
      }, TYPING_DELAY_MS);
      return () => clearTimeout(typingTimer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("searchKeyword"), isTyping]);

  const selectSearchResult = async (data: SearchData) => {
    const { name, id, artists, release_date, images } = data;
    const artist = artists[0].name;
    const decade = getDecade(release_date);
    const imgUrl = images[0].url;
    setValue("blurHash", await getBlurhash(imgUrl));
    setValue("artist", artist);
    setValue("newAlbumId", id);
    setValue("searchKeyword", name);
    if (!watch("activeTagKeys")) setValue("activeTagKeys", [decade]);
    setSearchData(undefined);
    setIsTyping(false);
  };

  return (
    <form onSubmit={onSubmit} className={styles.container}>
      <div className={styles.pageTitle}>{`${isUpdatePage ? "수정" : "업로드"}`} 페이지</div>

      {/* 장르 */}
      <div className={styles.blockContainer}>
        <label className={styles.blockTitle}>장르</label>
        <div className={styles.selectContainer}>
          <select
            {...register("genre")}
            className={styles.smallInput}
            onChange={(e) => {
              setValue("genre", e.target.value);
            }}
          >
            <option value="">--장르를 선택해주세요--</option>
            {Object.entries(GENRES).map(([key, value]) => {
              return (
                <option value={key} key={key}>
                  {value}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* 애플뮤직 링크 */}
      <div className={styles.blockContainer}>
        <label className={styles.blockTitle}>링크(Apple Music)</label>
        <input
          {...register("link")}
          className={styles.input}
          onChange={(e) => {
            setValue("link", e.target.value);
          }}
        />
      </div>

      {/* 앨범 제목 */}
      <div className={styles.blockContainer}>
        <label className={styles.blockTitle}>앨범 제목</label>
        <div style={{ position: "relative" }}>
          <input
            {...register("searchKeyword")}
            className={styles.input}
            onChange={(e) => {
              setValue("searchKeyword", e.target.value);
              setIsTyping(true);
            }}
            placeholder="검색어를 입력해주세요"
          />
          {!isTyping && searchData && (
            <AlbumSearchModal
              searchKeyword={getValues("searchKeyword")}
              searchData={searchData}
              selectSearchResult={selectSearchResult}
            />
          )}
        </div>
      </div>

      {/* 앨범 ID */}
      <div className={styles.blockContainer} style={updatePageExclusive}>
        <label className={styles.blockTitle}>앨범 ID(Spotify)</label>
        <div className={styles.input}>{getValues("newAlbumId")}</div>
      </div>

      {/* 발매일 */}
      <div className={styles.blockContainer} style={updatePageExclusive}>
        <label className={styles.blockTitle}>발매일</label>
        <div className={styles.input}>{getValues("albumReleaseDate")}</div>
      </div>

      {/* 아티스트 ID */}
      <div className={styles.blockContainer} style={updatePageExclusive}>
        <label className={styles.blockTitle}>아티스트 ID(Spotify)</label>
        <input
          {...register("artistId")}
          className={styles.input}
          onChange={(e) => {
            setValue("artistId", e.target.value);
          }}
        />
      </div>

      {/* 별점 */}
      <div className={styles.blockContainer}>
        <label className={styles.blockTitle}>별점</label>
        <Rate
          defaultValue={3}
          value={watch("score")}
          count={5}
          allowHalf={true}
          onChange={(value: number) => {
            setValue("score", value);
          }}
          className={styles.rcRate}
        />
      </div>

      {/* 제목 */}
      <div className={styles.blockContainer}>
        <label className={styles.blockTitle}>제목</label>
        <input
          {...register("title")}
          className={styles.input}
          onChange={(e) => {
            setValue("title", e.target.value);
          }}
        />
      </div>

      {/* 글 */}
      <div className={`${styles.blockContainer} ${styles.editor}`}>
        <label className={styles.blockTitle}>글</label>
        <ToastEditorNoSSR content={getValues("markdown") ?? ""} editorRef={editorRef} />
      </div>

      {/* 태그 */}
      <TagsEditor
        activeTagKeys={watch("activeTagKeys").flat()}
        setCurrentTagKeys={(action) => {
          const result = typeof action === "function" ? action(getValues("activeTagKeys")) : action;
          setValue("activeTagKeys", result);
        }}
      />

      {/* 비디오 링크 */}
      <VideoLinksEditor
        videos={watch("videos")}
        videoCount={watch("videoCount")}
        setVideoCount={(action) => {
          const result = typeof action === "function" ? action(getValues("videoCount")) : action;
          setValue("videoCount", result);
        }}
        setVideos={(action) => {
          const result = typeof action === "function" ? action(getValues("videos")) : action;
          setValue("videos", result);
        }}
      />

      {/* 작성일 */}
      <div className={styles.blockContainer}>
        <label className={styles.blockTitle}>작성일</label>
        <DatePicker
          locale={ko}
          selected={watch("uploadDate")}
          onChange={(date) => date && setValue("uploadDate", date)}
          dateFormat={"yyyy년 MM월 dd일"}
          className={`${styles.dateInput} ${styles.input}`}
        />
      </div>

      {/* 제출 버튼 */}
      <div className={styles.buttonWrapper}>
        <button type="submit" className={`${styles.button} ${styles.submit}`} onClick={onSubmit}>
          제출하기
        </button>
      </div>
    </form>
  );
}
