import { formatDate, isAdminPage } from "../../modules/utils";
import styles from "./PostText.module.css";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AlbumInfo } from "../../modules/types";
import { DEFAULT_TAGS, GENRES } from "@/app/modules/constants";
import Markdown from "react-markdown";
import { toGenrePage } from "@/app/modules/paths";
import Comment from "./Utterances";

interface PostTextProps {
  postData: AlbumInfo;
}

export const PostText = ({ postData }: PostTextProps) => {
  const pathName = usePathname();
  const { id, album, artist, title, text, tagKeys, uploadDate, markdown, genre } = postData;
  const paragraphs = text.split("\n");
  const replyTitle = `${artist} - ${album}`;

  return (
    <article className={styles.container}>
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
              style={isSubTitle ? { fontWeight: 600 } : undefined}
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
        {
          <Link href={toGenrePage(pathName, genre)} className={styles.tagItem}>
            {`#${GENRES[genre]}`}
          </Link>
        }
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
      <Comment />
    </article>
  );
};
