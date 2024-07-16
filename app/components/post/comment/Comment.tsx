import { useAtomValue } from "jotai";
import styles from "./Comment.module.css";
import { userIdAtom, userImageAtom } from "@/app/modules/atoms";
import { Comment, Reply } from "@/app/modules/types";
import React, { useState } from "react";
import { CommentEditInput } from "./CommentEditInput";
import { CommentManageModal } from "./CommentManageModal";
import { Heart } from "./Heart";
import { ReplyInput } from "./ReplyInput";

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
  comment: Comment;
  replies: Reply[];
  albumId: string;
  fetchComments: any;
}

export const CommentItem = ({ comment, replies, albumId, fetchComments }: CommentItemProps) => {
  const userImage = useAtomValue(userImageAtom);
  const { userId, userName, userComment, date } = comment;
  const dateDiff = formatTimeDifference(date);
  const [showHandleCommentModal, setShowHandleCommentModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const currentUserId = useAtomValue(userIdAtom);
  const isUserCommentOwner = userId === currentUserId;
  const [showReplyModal, setShowReplyModal] = useState<boolean>(false);
  const commentId = comment._id;
  const [showHandleReplyModal, setShowHandleReplyModal] = useState<boolean>(false);

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
              {isUserCommentOwner && <button onClick={handleComment}>···</button>}
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
            <button
              onClick={() => {
                setShowReplyModal(!showReplyModal);
              }}
              className={styles.button}
            >
              답글
            </button>
            <Heart comment={comment} fetchComments={fetchComments} />
          </div>
          <div>
            {showReplyModal && (
              <ReplyInput
                comment={comment}
                albumId={albumId}
                fetchComments={fetchComments}
                setShowReplyModal={setShowReplyModal}
              />
            )}
          </div>

          {replies.map((reply) => {
            const isReply = commentId === reply.commentId;
            return (
              isReply && (
                <div className={styles.commentContainer} key={reply._id}>
                  <div className={styles.userImageWrapper}>
                    <img src={userImage} alt="user-Image" className={styles.userImage} />
                  </div>
                  <div className={styles.replyContainer}>
                    <div className={styles.commentDetailWrapper}>
                      <div>{`${reply.userId} · ${formatTimeDifference(reply.date)}`}</div>
                      <div className={styles.commentRightDetailWrapper}>
                        {isUserCommentOwner && <button onClick={handleComment}>···</button>}
                        <CommentManageModal
                          userId={userId}
                          comment={reply}
                          showHandleCommentModal={showHandleReplyModal}
                          setShowHandleCommentModal={setShowHandleReplyModal}
                          setIsEditing={setIsEditing}
                          fetchComments={fetchComments}
                        />
                      </div>
                    </div>
                    <form className={styles.formContainer}>
                      <div className={styles.textareaWrapper}>
                        <span className={styles.commentUserId}>@{reply.commentUserId}</span>
                        <span>{reply.userComment}</span>
                      </div>
                    </form>
                    <div className={styles.commentDetailWrapper}>
                      <button
                        onClick={() => {
                          setShowReplyModal(!showReplyModal);
                        }}
                        className={styles.button}
                      >
                        답글
                      </button>
                      {/* FIXME: 답글에 맞게 수정 */}
                      <Heart comment={comment} fetchComments={fetchComments} />
                    </div>
                    {/* {대댓글 input 자리} */}
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface CommentResultProps {
  comments: Comment[];
  replies: Reply[];
  albumId: string;
  fetchComments: any;
}

export const CommentItems = ({ comments, replies, albumId, fetchComments }: CommentResultProps) => {
  const commentCount = comments?.length;

  return comments ? (
    <div>
      <div className={styles.commentCount}>{`댓글 ${commentCount}`}</div>
      {comments.map((comment: Comment) => {
        return (
          // eslint-disable-next-line react/jsx-key
          <CommentItem
            key={comment._id}
            comment={comment}
            albumId={albumId}
            fetchComments={fetchComments}
            replies={replies}
          />
        );
      })}
    </div>
  ) : null;
};
