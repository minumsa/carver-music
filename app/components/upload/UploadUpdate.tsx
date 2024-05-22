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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { AlbumSearchModal } from "./AlbumSearchModal";
import VideoLinksEditor from "./VideoLinksEditor/VideoLinksEditor";
import { TagsEditor } from "./TagsEditor/TagsEditor";

interface UpdateProps {
  currentId: string;
}

export default function UploadUpdate({ currentId }: UpdateProps) {
  const isUpdatePage = currentId.length > 0;
  const [newAlbumId, setNewAlbumId] = useState("");
  const [artist, setArtist] = useState("");
  const [artistId, setArtistId] = useState("");
  const [genre, setGenre] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [albumReleaseDate, setAlbumReleaseDate] = useState<string>("");
  const [uploadDate, setUploadDate] = useState(new Date());
  const [videoCount, setVideoCount] = useState(1);
  const [videos, setVideos] = useState<Video[]>([{ title: "", url: "" }]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [searchData, setSearchData] = useState<SearchData[]>();
  const [isTyping, setIsTyping] = useState(false);
  const [currentTagKeys, setCurrentTagKeys] = useState<string[]>([]);
  const [blurHash, setBlurHash] = useState("");
  const updatePageExclusive = { display: isUpdatePage ? undefined : "none" };
  const { register, handleSubmit, setValue, getValues, watch } = useForm({
    defaultValues: {
      albumId: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    const { albumId } = data;
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
        toast.success(isUpdatePage ? "수정 완료 😻" : "게시글 작성 완료 😻");
      } catch (error) {
        console.error(`${isUpdatePage ? "updateData" : "uploadData"} 호출에 실패했습니다:`, error);
        toast.error(`${isUpdatePage ? "수정 실패 😿" : "게시글 작성 실패 😿"}`);
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
      setNewAlbumId(id);
      setArtist(artist);
      setArtistId(artistId);
      setGenre(genre);
      setLink(link);
      setText(text);
      setScore(score);
      setUploadDate(new Date(uploadDate));
      setSearchKeyword(album);
      setCurrentTagKeys(tagKeys);
      setAlbumReleaseDate(new Date(releaseDate).toString());
      setBlurHash(blurHash);

      const hasVideo = videos.length > 0;

      if (hasVideo) {
        setVideos(videos);
        setVideoCount(videos.length);
      }
    }

    if (isUpdatePage) getData();
  }, [currentId]);

  const handleSearch = async () => {
    const result = await searchSpotify(searchKeyword);
    setSearchData(result);
  };

  useEffect(() => {
    const isSearching = isTyping && searchKeyword;
    if (isSearching) {
      const typingTimer = setTimeout(() => {
        handleSearch();
      }, 1000);

      return () => clearTimeout(typingTimer);
    }
  }, [searchKeyword, isTyping]);

  const handleClickSearchResult = (data: SearchData) => {
    const { name, id, artists } = data;
    setArtist(artists[0].name);
    setNewAlbumId(id);
    setSearchKeyword(name);
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
            className={styles.smallInput}
            value={genre}
            onChange={(e) => {
              setGenre(e.target.value);
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
          className={styles.input}
          value={link}
          onChange={(e) => {
            setLink(e.target.value);
          }}
        />
      </div>

      {/* 앨범 제목 */}
      <div className={styles.blockContainer}>
        <div className={styles.blockTitle}>앨범 제목</div>
        <div style={{ position: "relative" }}>
          <input
            className={styles.input}
            value={searchKeyword}
            onChange={(e) => {
              setSearchKeyword(e.target.value);
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
        <div className={styles.input}>{newAlbumId}</div>
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
          className={styles.input}
          value={artistId}
          onChange={(e) => {
            setArtistId(e.target.value);
          }}
        />
      </div>

      {/* BlurHash String */}
      <div className={styles.blockContainer}>
        <div className={styles.blockTitle}>BlurHash String</div>
        <input
          className={styles.input}
          value={blurHash}
          onChange={(e) => {
            setBlurHash(e.target.value);
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
          className={`${styles.input} ${styles.inputText}`}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
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
        <div className={`${styles.button} ${styles.submit}`}>제출하기</div>
      </div>
    </form>
  );
}
