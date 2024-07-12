import { useAtomValue } from "jotai";
import styles from "./Comment.module.css";
import { userImageAtom } from "@/app/modules/atoms";
import { Comment } from "@/app/modules/types";
import React from "react";

// FIXME: any 타입 모두 올바르게 지정
// FIXME: userId 말고 userName 표시
// FIXME: 코드 정리
const formatTimeDifference = (date: Date): string => {
  const currentDate = new Date();
  const differenceInMilliseconds = currentDate.getTime() - new Date(date).getTime();
  const differenceInMinutes = differenceInMilliseconds / (1000 * 60);
  const differenceInHours = differenceInMinutes / 60;
  const differenceInDays = differenceInHours / 24;

  if (differenceInMinutes < 1) {
    return `방금 전`;
  } else if (differenceInMinutes < 60) {
    return `${Math.floor(differenceInMinutes)}분 전`;
  } else if (differenceInHours < 24) {
    return `${Math.floor(differenceInHours)}시간 전`;
  } else {
    return `${Math.floor(differenceInDays)}일 전`;
  }
};

export const CommentTmp = ({ comment }: any) => {
  const userImage = useAtomValue(userImageAtom);
  const { userId, userComment, date } = comment;
  const dateDiff = formatTimeDifference(date);

  return (
    <div className={styles.container}>
      <div className={styles.commentContainer}>
        <div className={styles.userImageWrapper}>
          <img src={userImage} alt="user-Image" className={styles.userImage} />
        </div>
        <div className={styles.rightContainer}>
          <form className={styles.formContainer}>
            <div className={styles.textareaWrapper}>{userComment}</div>
          </form>
          <div className={styles.commentDetailWrapper}>
            <div>{`${userId} · ${dateDiff}`}</div>
            <div>···</div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CommentTmpProps {
  comments: Comment[];
}

export const CommentResult = ({ comments }: CommentTmpProps) => {
  const commentCount = comments.length;
  return comments ? (
    <div>
      <div className={styles.commentCount}>{`댓글 ${commentCount}`}</div>
      {comments.map((comment: Comment) => {
        return (
          <React.Fragment key={comment.userComment}>
            <CommentTmp comment={comment} />
          </React.Fragment>
        );
      })}
    </div>
  ) : undefined;
};
