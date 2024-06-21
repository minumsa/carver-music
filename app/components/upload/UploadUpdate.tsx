import { useEffect, useRef, useState } from "react";
import styles from "./UploadUpdate.module.css";
import React from "react";
import {
  NewDataForUpdate,
  fetchAlbumById,
  fetchSpotify,
  searchSpotify,
  updateData,
  uploadData,
} from "../../modules/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Rate from "rc-rate";
import "rc-rate/assets/index.css";
import { SearchData, SpotifyAlbumData, Video } from "../../modules/types";
import { GENRES } from "../../modules/constants";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { AlbumSearchModal } from "./AlbumSearchModal";
import VideoLinksEditor from "./VideoLinksEditor/VideoLinksEditor";
import { TagsEditor } from "./TagsEditor/TagsEditor";
import { getBlurhash, getDecade } from "@/app/modules/utils";
import dynamic from "next/dynamic";

const TYPING_DELAY_MS = 1000;

interface UpdateProps {
  currentId: string;
}

export interface Form {
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
  currentTagKeys: string[];
  password: string;
}

export default function UploadUpdate({ currentId }: UpdateProps) {
  const isUpdatePage = currentId.length > 0;
  const [searchData, setSearchData] = useState<SearchData[]>();
  const [isTyping, setIsTyping] = useState(false);
  const updatePageExclusive = { display: isUpdatePage ? undefined : "none" };
  const ToastEditorNoSSR = dynamic(() => import("./ToastEditor/ToastEditor"), {
    ssr: false,
  });
  const ref = useRef<any>(null);
  const { register, handleSubmit, setValue, getValues, watch } = useForm<Form>({
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
      currentTagKeys: [],
      markdown: "",
      password: "",
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
      currentTagKeys,
      password,
    } = data;
    const filteredText = text.replace(/\[\d+\]/g, "");
    const newSpotifyAlbumData: SpotifyAlbumData | undefined = await fetchSpotify(newAlbumId);
    // 에디터 작성 내용 markdown으로 저장
    const editorIns = ref?.current?.getInstance();
    const markdown = editorIns?.getMarkdown();

    if (newSpotifyAlbumData) {
      const newData: NewDataForUpdate = {
        newSpotifyAlbumData,
        title,
        originalAlbumId: albumId,
        genre,
        link,
        text: filteredText,
        uploadDate,
        score,
        videos,
        tagKeys: currentTagKeys.flat(),
        blurHash,
        markdown,
      };

      try {
        const apiMethod = isUpdatePage ? updateData : uploadData;
        await apiMethod({ newData, password });
      } catch (error) {
        console.error(`${isUpdatePage ? "updateData" : "uploadData"} 작업에 실패했습니다:`, error);
      }
    }
  });

  useEffect(() => {
    async function getAlbum() {
      const response = await fetchAlbumById(currentId);
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
      } = response;
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
      setValue("markdown", markdown);
      const decade = getDecade(releaseDate);
      const hasDecadeTag = tagKeys.includes(decade);
      const trueVideos = videos.filter((video: Video) => video.title.length > 0);
      const hasVideo = trueVideos.length > 0;

      if (hasDecadeTag) {
        setValue("currentTagKeys", [tagKeys]);
      } else {
        setValue("currentTagKeys", [...tagKeys, decade]);
      }

      if (hasVideo) {
        setValue("videos", trueVideos);
        setValue("videoCount", trueVideos.length);
      }
    }

    if (isUpdatePage) getAlbum();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId]);

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
    setValue("currentTagKeys", [decade]);
    setValue("artist", artist);
    setValue("newAlbumId", id);
    setValue("searchKeyword", name);
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
        <ToastEditorNoSSR content={getValues("markdown") ?? ""} editorRef={ref} />
        {/* <textarea
          {...register("text")}
          className={`${styles.input} ${styles.inputText}`}
          onChange={(e) => {
            setValue("text", e.target.value);
          }}
        /> */}
      </div>

      {/* FIXME: setValues props 타입 최대한 적절하게 변경 */}
      {/* 태그 */}
      <TagsEditor
        currentTagKeys={watch("currentTagKeys").flat()}
        setCurrentTagKeys={(action) => {
          const result =
            typeof action === "function" ? action(getValues("currentTagKeys")) : action;
          setValue("currentTagKeys", result);
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
          selected={watch("uploadDate")}
          onChange={(date) => date && setValue("uploadDate", date)}
          dateFormat={"yyyy/MM/dd"}
          className={`${styles.dateInput} ${styles.input}`}
        />
      </div>

      {/* 관리자 비밀번호 */}
      <div className={styles.blockContainer}>
        <label className={styles.blockTitle}>관리자 비밀번호</label>
        <input
          {...register("password")}
          className={styles.smallInput}
          onChange={(e) => {
            setValue("password", e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSubmit();
            }
          }}
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
