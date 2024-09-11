import { formatDate, isAdminPage } from "../../modules/utils";
import styles from "./PostText.module.css";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AlbumData } from "../../modules/types";
import { DEFAULT_TAGS } from "@/app/modules/constants/tags";
import Markdown from "react-markdown";
import { toGenrePage } from "@/app/modules/paths";
import { useEffect, useRef, useState } from "react";
import { Comments } from "./comment/Comments";
import { GENRES } from "@/app/modules/constants/genres";

interface PostTextProps {
  postData: AlbumData;
}

export const PostText = ({ postData }: PostTextProps) => {
  const pathName = usePathname();
  const { id, title, text, tagKeys, uploadDate, markdown, genre } = postData;
  const paragraphs = text.split("\n");
  const genreTag = `#${GENRES[genre]}`;
  const [hasNoScroll, setHasNoScroll] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const checkScroll = () => {
    if (window.innerWidth > 800) {
      if (containerRef.current) {
        const hasNoScroll = containerRef.current.scrollHeight <= containerRef.current.clientHeight;
        setHasNoScroll(hasNoScroll);
      }
    } else {
      setHasNoScroll(false);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => {
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const noScrollStyle = hasNoScroll ? { padding: "10px 0 30px 30px" } : undefined;

  return (
    <article className={styles.container} style={noScrollStyle} ref={containerRef}>
      {title && <h1 className={styles.title}>{title}</h1>}
      {markdown ? (
        <div className={styles.viewerWrapper}>
          <Markdown>{markdown}</Markdown>
        </div>
      ) : (
        paragraphs.map((paragraph, index) => {
          const isLineBreak = paragraph === "";
          const isSubTitle =
            (paragraph.length < 50 && !paragraph.includes(".") && !paragraph.includes("[")) ||
            paragraph.includes("feat.");
          return isLineBreak ? (
            <p key={index}></p>
          ) : (
            <p
              key={index}
              className={styles.paragraph}
              style={isSubTitle ? { fontWeight: 500 } : undefined}
            >
              {paragraph}
            </p>
          );
        })
      )}
      <div className={styles.postDateContainer}>
        <div className={styles.postDate}>작성일</div>
        <div>{formatDate(uploadDate)}</div>
      </div>
      <div className={styles.tagContainer}>
        {genre && (
          <Link href={toGenrePage(pathName, genre)} className={styles.tagItem}>
            {genreTag}
          </Link>
        )}
        {tagKeys.map((tagKey: string, index: number) => {
          return (
            <Link
              href={
                isAdminPage(pathName) ? `/admin/search/tag/${tagKey}/1` : `/search/tag/${tagKey}/1`
              }
              key={index}
              className={styles.tagItem}
            >
              {DEFAULT_TAGS[tagKey]}
            </Link>
          );
        })}
      </div>
      <div className={styles.postDivider}></div>
      {/* 댓글 창 위치 */}
      <Comments albumId={id} />
    </article>
  );
};
