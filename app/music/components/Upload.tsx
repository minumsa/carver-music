import { forwardRef, useEffect, useState } from "react";
import styles from "../music.module.css";
import React from "react";
import { fetchSpotify, searchSpotify, uploadData } from "../modules/api";
import { contents } from "../modules/data";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import Rate from "rc-rate";
import "rc-rate/assets/index.css";

// FIXME: 타입 any 없애기
interface SearchData {
  albums: any;
  items: any;
  artists: any;
  name: string;
  release_date: string;
  images: any[];
  id: string;
}

interface Video {
  title: string;
  url: string;
}

export default function Upload() {
  const [albumKeyword, setAlbumKeyword] = useState<string>("");
  // FIXME: albumKeyword로 가져온 정보에서 albumId 넘겨줘야 함
  const [albumId, setAlbumId] = useState<string>("");
  const [album, setAlbum] = useState("");
  const [searchData, setSearchData] = useState<SearchData[]>();
  const [isTyping, setIsTyping] = useState(false);
  const [genre, setGenre] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [artist, setArtist] = useState("");
  const [score, setScore] = useState<number>(0);
  const [password, setPassword] = useState<string>("");
  const [uploadDate, setUploadDate] = useState(new Date());
  const [videoCount, setVideoCount] = useState(1);
  const [videos, setVideos] = useState<Video[]>([{ title: "", url: "" }]);
  const router = useRouter();

  const handleSearch = async () => {
    const result = await searchSpotify(albumKeyword);
    setSearchData(result);
  };

  useEffect(() => {
    if (isTyping && albumKeyword.length > 0) {
      const typingTimer = setTimeout(() => {
        handleSearch();
      }, 1000);

      return () => clearTimeout(typingTimer);
    }
  }, [albumKeyword, isTyping]);

  const handleUpload = async () => {
    const newSpotifyAlbumData = await fetchSpotify({
      albumId,
      genre,
      link,
      text,
      uploadDate,
    });

    if (newSpotifyAlbumData) {
      try {
        await uploadData(newSpotifyAlbumData, score, videos, password);
        router.back();
      } catch (error) {
        console.error("uploadData 호출에 실패했습니다:", error);
      }
    }
  };

  const handlePasswordEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleUpload();
    }
  };

  const handleModal = (data: SearchData) => {
    setAlbumKeyword(data.name);
    setAlbumId(data.id);
    setArtist(data.artists[0].name);
    setAlbum(data.name);
    setSearchData(undefined);
    setIsTyping(false);
  };

  return (
    <div
      className={styles["album-container"]}
      style={{
        minWidth: 0,
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "50px",
      }}
    >
      <div className={styles["upload-container"]}>
        <div className={styles["title"]}>업로드 페이지</div>
        <div className={styles["upload-item-title"]}>장르</div>
        <div className={styles["select-container"]}>
          <select
            className={styles["select"]}
            value={genre}
            onChange={e => {
              setGenre(e.target.value);
            }}
          >
            <option value="">--장르를 선택해주세요--</option>
            {Object.entries(contents).map(([key, value]) => {
              return (
                <option value={key} key={key}>
                  {value}
                </option>
              );
            })}
          </select>
        </div>
        <div className={styles["upload-item-title"]}>앨범 제목</div>
        <div>
          <input
            className={styles["input"]}
            value={albumKeyword}
            onChange={e => {
              setAlbumKeyword(e.target.value);
              setIsTyping(true);
            }}
            placeholder="검색어를 입력해주세요"
          />
          <div
            className={styles["search-album-modal-container"]}
            style={{ display: albumKeyword && searchData ? "flex" : "none" }}
          >
            {searchData?.map((data, index) => {
              const artist = data.artists[0].name;
              const album = data.name;
              const releaseYear = data.release_date.slice(0, 4);
              const imageUrl = data.images[2].url;
              return (
                <div
                  className={styles["search-album-modal"]}
                  key={index}
                  onClick={() => {
                    handleModal(data);
                  }}
                >
                  <div className={styles["search-album-image-container"]}>
                    <img
                      className={styles["search-album-image"]}
                      src={imageUrl}
                      alt="search-album-image"
                      loading="lazy"
                    />
                  </div>
                  <div className={styles["search-album-text"]}>
                    <div>
                      <span>{album}</span>
                      <span style={{ paddingLeft: "5px", color: "#757A84" }}>({releaseYear})</span>
                    </div>
                    <div style={{ fontWeight: 400 }}>{artist}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles["upload-item-title"]}>앨범 ID</div>
        <input className={`${styles["input"]} ${styles["input-link"]}`} value={albumId} />
        <div className={styles["upload-item-title"]}>링크(Apple Music)</div>
        <input
          className={`${styles["input"]} ${styles["input-link"]}`}
          value={link}
          onChange={e => {
            setLink(e.target.value);
          }}
        />
        <div className={styles["upload-item-title"]}>별점</div>
        <Rate
          defaultValue={3}
          count={5}
          allowHalf={true}
          onChange={(value: number) => {
            setScore(value);
          }}
          className={styles["rc-rate"]}
          style={{ fontSize: "45px", marginBottom: "30px" }}
        />
        <div className={styles["upload-item-title"]}>글</div>
        <textarea
          className={`${styles["input"]} ${styles["input-text"]}`}
          value={text}
          onChange={e => {
            setText(e.target.value);
          }}
        />
        {new Array(videoCount).fill(null).map((_, index) => {
          const tmpVideos = [...videos];
          const videoNumber = index + 1;

          return (
            <div key={index}>
              <div className={styles["upload-item-title"]}>
                {index === 0 ? (
                  <a
                    href={`https://www.youtube.com/results?search_query=${artist} ${album} MV 자막`}
                    target="_blank"
                    style={{ color: "#cfcfcf" }}
                  >
                    <span>{`영상 제목 ${videoNumber}`}</span>
                  </a>
                ) : (
                  <span>{`영상 제목 ${videoNumber}`}</span>
                )}
                {index === 0 && (
                  <span
                    style={{
                      position: "absolute",
                      marginLeft: "10px",
                      backgroundColor: "#eee",
                      color: "#333",
                      padding: "0 5px",
                      borderRadius: "10px",
                      fontWeight: 500,
                      fontSize: "1rem",
                      marginTop: "5.5px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setVideoCount(prev => prev + 1);
                      setVideos([...videos, { title: "", url: "" }]);
                    }}
                  >
                    +
                  </span>
                )}
              </div>
              <input
                className={`${styles["input"]} ${styles["input-link"]}`}
                value={videos[index].title}
                onChange={e => {
                  // setMusicVideoTitle(e.target.value);
                  tmpVideos[index] = { ...tmpVideos[index], title: e.target.value };
                  setVideos(tmpVideos);
                }}
              />
              <div className={styles["upload-item-title"]}>영상 링크</div>
              <input
                className={`${styles["input"]} ${styles["input-link"]}`}
                value={videos[index].url}
                onChange={e => {
                  tmpVideos[index] = { ...tmpVideos[index], url: e.target.value };
                  setVideos(tmpVideos);
                }}
              />
            </div>
          );
        })}
        <div className={styles["upload-item-title"]}>작성일</div>
        <DatePicker
          selected={uploadDate}
          onChange={date => date && setUploadDate(date)}
          dateFormat={"yyyy/MM/dd"}
          className={styles["date-input"]}
        />
        <div className={styles["upload-item-title"]} style={{ marginTop: "50px" }}>
          관리자 비밀번호
        </div>
        <input
          className={styles["input"]}
          value={password}
          onChange={e => {
            setPassword(e.target.value);
          }}
          onKeyDown={handlePasswordEnter}
          style={{ width: "240px" }}
        />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            className={`${styles["button"]} ${styles["submit"]}`}
            onClick={() => {
              handleUpload();
            }}
          >
            제출하기
          </div>
        </div>
      </div>
    </div>
  );
}
