import { useEffect, useState } from "react";
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
import { getDecadeTagKey } from "@/app/modules/utils";

interface UpdateProps {
  currentId: string;
}

export default function UploadUpdate({ currentId }: UpdateProps) {
  const isUpdatePage = currentId.length > 0;
  const [password, setPassword] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [albumReleaseDate, setAlbumReleaseDate] = useState<string>("");
  const [uploadDate, setUploadDate] = useState(new Date());
  const [videoCount, setVideoCount] = useState(1);
  const [videos, setVideos] = useState<Video[]>([{ title: "", url: "" }]);
  const [searchData, setSearchData] = useState<SearchData[]>();
  const [isTyping, setIsTyping] = useState(false);
  const [currentTagKeys, setCurrentTagKeys] = useState<string[]>([]);
  const updatePageExclusive = { display: isUpdatePage ? undefined : "none" };
  const { register, handleSubmit, setValue, getValues, watch } = useForm({
    defaultValues: {
      albumId: "",
      newAlbumId: "",
      artist: "",
      artistId: "",
      genre: "",
      link: "",
      text: "",
      blurHash: "",
      searchKeyword: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    const { albumId, newAlbumId, genre, link, text, blurHash } = data;
    const filteredText = text.replace(/\[\d+\]/g, "");
    const newSpotifyAlbumData: SpotifyAlbumData | undefined = await fetchSpotify(newAlbumId);

    if (newSpotifyAlbumData) {
      const newData: NewDataForUpdate = {
        newSpotifyAlbumData,
        originalAlbumId: albumId,
        genre,
        link,
        text: filteredText,
        uploadDate,
        score,
        videos,
        tagKeys: currentTagKeys,
        blurHash,
      };

      try {
        const apiMethod = isUpdatePage ? updateData : uploadData;
        await apiMethod({ newData, password });
      } catch (error) {
        console.error(`${isUpdatePage ? "updateData" : "uploadData"} 호출에 실패했습니다:`, error);
      }
    }
  });

  useEffect(() => {
    async function getData() {
      const fetchData = await fetchAlbumById(currentId);
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
      } = fetchData;
      setValue("albumId", id);
      setValue("newAlbumId", id);
      setValue("artist", artist);
      setValue("artistId", artistId);
      setValue("genre", genre);
      setValue("link", link);
      setValue("text", text);
      setValue("blurHash", blurHash);
      setValue("searchKeyword", album);
      setScore(score);
      setUploadDate(new Date(uploadDate));
      setAlbumReleaseDate(new Date(releaseDate).toString());

      const releaseYearTagKey = getDecadeTagKey(releaseDate);
      const hasReleaseYearTag = tagKeys.includes(releaseYearTagKey);
      const hasVideo = videos.length > 0;

      if (hasReleaseYearTag) {
        setCurrentTagKeys([...tagKeys]);
      } else {
        setCurrentTagKeys([...tagKeys, releaseYearTagKey]);
      }

      if (hasVideo) {
        setVideos(videos);
        setVideoCount(videos.length);
      }
    }

    if (isUpdatePage) getData();
  }, [currentId]);

  const handleSearch = async () => {
    const result = await searchSpotify(getValues("searchKeyword"));
    setSearchData(result);
  };

  useEffect(() => {
    const isSearching = isTyping && getValues("searchKeyword");
    if (isSearching) {
      const typingTimer = setTimeout(() => {
        handleSearch();
      }, 1000);

      return () => clearTimeout(typingTimer);
    }
  }, [getValues("searchKeyword"), isTyping]);

  const handleClickSearchResult = (data: SearchData) => {
    const { name, id, artists, release_date } = data;
    const releaseYearTagKey = getDecadeTagKey(release_date);

    setCurrentTagKeys([releaseYearTagKey]);
    setValue("artist", artists[0].name);
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
        <div className={styles.blockTitle}>장르</div>
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
        <div className={styles.blockTitle}>링크(Apple Music)</div>
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
        <div className={styles.blockTitle}>앨범 제목</div>
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
          {searchData && (
            <AlbumSearchModal searchData={searchData} onSelect={handleClickSearchResult} />
          )}
        </div>
      </div>

      {/* 앨범 ID */}
      <div className={styles.blockContainer} style={updatePageExclusive}>
        <div className={styles.blockTitle}>앨범 ID(Spotify)</div>
        <div className={styles.input}>{getValues("newAlbumId")}</div>
      </div>

      {/* 발매일 */}
      <div className={styles.blockContainer} style={updatePageExclusive}>
        <div className={styles.blockTitle}>발매일</div>
        <div className={styles.input}>{albumReleaseDate}</div>
      </div>

      {/* 아티스트 ID */}
      <div className={styles.blockContainer} style={updatePageExclusive}>
        <div className={styles.blockTitle}>아티스트 ID(Spotify)</div>
        <input
          {...register("artistId")}
          className={styles.input}
          onChange={(e) => {
            setValue("artistId", e.target.value);
          }}
        />
      </div>

      {/* BlurHash String */}
      <div className={styles.blockContainer}>
        <div className={styles.blockTitle}>BlurHash String</div>
        <input
          {...register("blurHash")}
          className={styles.input}
          onChange={(e) => {
            setValue("blurHash", e.target.value);
          }}
        />
      </div>

      {/* 별점 */}
      <div className={styles.blockContainer}>
        <div className={styles.blockTitle}>별점</div>
        <Rate
          defaultValue={3}
          value={score}
          count={5}
          allowHalf={true}
          onChange={(value: number) => {
            setScore(value);
          }}
          className={styles.rcRate}
        />
      </div>

      {/* 글 */}
      <div className={styles.blockContainer}>
        <div className={styles.blockTitle}>글</div>
        <textarea
          {...register("text")}
          className={`${styles.input} ${styles.inputText}`}
          onChange={(e) => {
            setValue("text", e.target.value);
          }}
        />
      </div>

      {/* 태그 */}
      <TagsEditor currentTagKeys={currentTagKeys} setCurrentTagKeys={setCurrentTagKeys} />

      {/* 비디오 링크 */}
      <VideoLinksEditor
        videos={videos}
        videoCount={videoCount}
        setVideoCount={setVideoCount}
        setVideos={setVideos}
      />

      {/* 작성일 */}
      <div className={styles.blockContainer}>
        <div className={styles.blockTitle}>작성일</div>
        <DatePicker
          selected={uploadDate}
          onChange={(date) => date && setUploadDate(date)}
          dateFormat={"yyyy/MM/dd"}
          className={`${styles.dateInput} ${styles.input}`}
        />
      </div>

      {/* 관리자 비밀번호 */}
      <div className={styles.blockContainer}>
        <div className={styles.blockTitle}>관리자 비밀번호</div>
        <input
          className={styles.smallInput}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </div>

      {/* 제출 버튼 */}
      <div className={styles.submitContainer}>
        <button type="submit" className={`${styles.button} ${styles.submit}`}>
          제출하기
        </button>
      </div>
    </form>
  );
}
