import { useAtomValue } from "jotai";
import styles from "./Comment.module.css";
import { userImageAtom } from "@/app/modules/atoms";
import { Comment } from "@/app/modules/types";
import React, { useState } from "react";
import { CommentEditInput } from "./CommentEditInput";
import { CommentManageModal } from "./CommentManageModal";
import { Heart } from "./Heart";

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

interface CommentItemProps {
  comment: any;
  albumId: string;
  fetchComments: any;
}

export const CommentItem = ({ comment, albumId, fetchComments }: CommentItemProps) => {
  const userImage = useAtomValue(userImageAtom);
  const { userId, userComment, date } = comment;
  const dateDiff = formatTimeDifference(date);
  const [showHandleCommentModal, setShowHandleCommentModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleComment = () => {
    setShowHandleCommentModal(!showHandleCommentModal);
  };

  return isEditing ? (
    <CommentEditInput fetchComments={fetchComments} comment={comment} setIsEditing={setIsEditing} />
  ) : (
    <div className={styles.container}>
      <div className={styles.commentContainer}>
        <div className={styles.userImageWrapper}>
          <img src={userImage} alt="user-Image" className={styles.userImage} />
        </div>
        <div className={styles.rightContainer}>
          <div className={styles.commentDetailWrapper}>
            <div>{`${userId} · ${dateDiff}`}</div>
            <div className={styles.commentRightDetailWrapper}>
              <button onClick={handleComment}>···</button>
              <CommentManageModal
                userId={userId}
                comment={comment}
                showHandleCommentModal={showHandleCommentModal}
                setShowHandleCommentModal={setShowHandleCommentModal}
                setIsEditing={setIsEditing}
                fetchComments={fetchComments}
              />
            </div>
          </div>
          <form className={styles.formContainer}>
            <div className={styles.textareaWrapper}>{userComment}</div>
          </form>
          <div className={styles.commentDetailWrapper}>
            <div>답글</div>
            <Heart comment={comment} fetchComments={fetchComments} />
          </div>
        </div>
      </div>
    </div>
  );
};

interface CommentResultProps {
  comments: Comment[];
  albumId: string;
  fetchComments: any;
}

export const CommentItems = ({ comments, albumId, fetchComments }: CommentResultProps) => {
  const commentCount = comments.length;

  return comments ? (
    <div>
      <div className={styles.commentCount}>{`댓글 ${commentCount}`}</div>
      {comments.map((comment: Comment) => {
        return (
          <React.Fragment key={comment._id}>
            <CommentItem comment={comment} albumId={albumId} fetchComments={fetchComments} />
          </React.Fragment>
        );
      })}
    </div>
  ) : undefined;
};
