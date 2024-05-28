import { formatDate, isAdminPage } from "../../modules/utils";
import styles from "./PostAlbumText.module.css";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AlbumInfo } from "../../modules/types";
import { DEFAULT_TAGS } from "../../modules/constants";

interface PostTextProps {
  postData: AlbumInfo;
}

export const PostText = ({ postData }: PostTextProps) => {
  const pathName = usePathname();
  const { title, text, tagKeys, uploadDate } = postData;
  const paragraphs = text.split("\n");

  return (
    <article className={styles.container}>
      {title && <h1 className={styles.title}>{title}</h1>}
      {paragraphs.map((paragraph, index) => {
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
      })}
      <div className={styles.tagContainer}>
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
      <div className={styles.postDateContainer}>
        <div className={styles.postDate}>작성일</div>
        <div>{formatDate(uploadDate)}</div>
      </div>
    </article>
  );
};
