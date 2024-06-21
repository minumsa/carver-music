import { formatDate, isAdminPage } from "../../modules/utils";
import styles from "./PostAlbumText.module.css";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AlbumInfo } from "../../modules/types";
import { DEFAULT_TAGS } from "@/app/modules/constants";
import { Viewer } from "@toast-ui/react-editor";

interface PostTextProps {
  postData: AlbumInfo;
}

// FIXME: 포스트 페이지에서 GET /admin/post/4Oz7K9DRwwGMN49i4NbVDT 500 in 273ms 에러 해결
export const PostText = ({ postData }: PostTextProps) => {
  const pathName = usePathname();
  const { title, text, tagKeys, uploadDate } = postData;
  const paragraphs = text.split("\n");

  return (
    <article className={styles.container}>
      {title && <h1 className={styles.title}>{title}</h1>}
      {postData.markdown ? (
        <div className={styles.viewerWrapper}>
          <Viewer initialValue={postData.markdown || ""} />
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
