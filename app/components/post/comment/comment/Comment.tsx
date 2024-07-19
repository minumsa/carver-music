import { useAtomValue } from "jotai";
import styles from "./Comment.module.css";
import { userIdAtom, userImageAtom } from "@/app/modules/atoms";
import { Comment, Reply } from "@/app/modules/types";
import React, { useState } from "react";
import { CommentEditInput } from "./CommentEditInput";
import { CommentManageButtons } from "./CommentManageButtons";
import { LikeComment } from "../like/LikeComment";
import { ReplyInput } from "../reply/ReplyInput";
import { ReplyManageButtons } from "../reply/ReplyManageButtons";
import { ReplyEditInput } from "../reply/ReplyEditInput";
import { formatTimeDifference } from "@/app/modules/utils";
import { LikeReply } from "../like/LikeReply";

// FIXME: any 타입 모두 올바르게 지정
// FIXME: userId 말고 userName 표시
// FIXME: 코드 정리

interface CommentItemProps {
  comment: Comment;
  replies: Reply[];
  albumId: string;
  fetchComments: any;
}

export const CommentItem = ({ comment, replies, albumId, fetchComments }: CommentItemProps) => {
  const { userId, userName, userComment, date, userImage } = comment;
  const dateDiff = formatTimeDifference(date);
  const [showCommentManageButtons, setShowCommentManageButtons] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const currentUserId = useAtomValue(userIdAtom);
  const commentId = comment._id;
  const [showReplyManageButtons, setShowReplyManageButtons] = useState<boolean>(false);
  const [showReplyModal, setShowReplyModal] = useState<boolean>(false);
  const [replyIsEditing, setReplyIsEditing] = useState<boolean>(false);
  const [activeReplyId, setActiveReplyId] = useState<string | null>();

  const handleComment = () => {
    setShowCommentManageButtons(!showCommentManageButtons);
  };

  const handleReply = (replyId: string) => {
    setActiveReplyId(replyId);
    setShowReplyManageButtons(!showReplyManageButtons);
  };

  return (
    <div className={styles.container}>
      {isEditing ? (
        <CommentEditInput
          fetchComments={fetchComments}
          comment={comment}
          setIsEditing={setIsEditing}
        />
      ) : (
        <div className={styles.commentContainer}>
          <div className={styles.userImageWrapper}>
            <img src={userImage} alt="user-Image" className={styles.userImage} />
          </div>
          <div className={styles.rightContainer}>
            <div className={styles.detailWrapper}>
              <div>{`${userName} · ${dateDiff}`}</div>
              <div className={styles.commentRightDetailWrapper}>
                {currentUserId === comment.userId && (
                  <button onClick={handleComment} className={styles.dotButton}>
                    ···
                  </button>
                )}
                <CommentManageButtons
                  userId={userId}
                  comment={comment}
                  showHandleModal={showCommentManageButtons}
                  setShowHandleModal={setShowCommentManageButtons}
                  setIsEditing={setIsEditing}
                  fetchComments={fetchComments}
                />
              </div>
            </div>
            <form className={styles.formContainer}>
              <div className={styles.textareaWrapper}>{userComment}</div>
            </form>
            <div className={styles.detailWrapper}>
              <button
                onClick={() => {
                  setShowReplyModal(!showReplyModal);
                }}
                className={styles.button}
              >
                답글
              </button>
              <LikeComment comment={comment} fetchComments={fetchComments} />
            </div>
          </div>
        </div>
      )}

      {showReplyModal && (
        <ReplyInput
          comment={comment}
          albumId={albumId}
          fetchComments={fetchComments}
          setShowReplyModal={setShowReplyModal}
        />
      )}

      {replies.map((reply) => {
        const isReply = commentId === reply.commentId;
        const test = activeReplyId === reply._id;
        return (
          isReply &&
          (replyIsEditing && test ? (
            <ReplyEditInput
              key={reply._id}
              fetchComments={fetchComments}
              reply={reply}
              setReplyIsEditing={setReplyIsEditing}
            />
          ) : (
            <div className={styles.commentContainer} key={reply._id}>
              <div className={styles.replyBackground}>
                <div className={styles.userImageWrapper}>
                  <img src={reply.userImage} alt="user-Image" className={styles.userImage} />
                </div>
                <div className={styles.replyContainer}>
                  <div className={styles.detailWrapper}>
                    <div>{`${reply.userName} · ${formatTimeDifference(reply.date)}`}</div>
                    <div className={styles.commentRightDetailWrapper}>
                      {currentUserId === reply.userId && (
                        <button onClick={() => handleReply(reply._id)}>···</button>
                      )}
                      <ReplyManageButtons
                        userId={userId}
                        reply={reply}
                        isActive={activeReplyId === reply._id}
                        showReplyManageButtons={showReplyManageButtons}
                        setShowReplyManageButtons={setShowReplyManageButtons}
                        handleReply={() => handleReply(reply._id)}
                        setReplyIsEditing={setReplyIsEditing}
                        fetchComments={fetchComments}
                      />
                    </div>
                  </div>
                  <form className={styles.formContainer}>
                    <div className={styles.textareaWrapper}>
                      <span className={styles.commentUserId}>@{comment.userName}</span>
                      <span>{reply.userComment}</span>
                    </div>
                  </form>
                  <div className={`${styles.detailWrapper} ${styles.likeReplyWrapper}`}>
                    <LikeReply reply={reply} fetchComments={fetchComments} />
                  </div>
                </div>
              </div>
            </div>
          ))
        );
      })}
    </div>
  );
};

interface CommentResultProps {
  comments: Comment[];
  replies: Reply[];
  albumId: string;
  fetchComments: () => Promise<void>;
}

export const CommentItems = ({ comments, replies, albumId, fetchComments }: CommentResultProps) => {
  const commentsCount = comments?.length;
  const repliescount = replies?.length;

  return comments ? (
    <>
      <div className={styles.commentCount}>{`댓글 ${commentsCount + repliescount}`}</div>
      {comments.map((comment: Comment) => {
        return (
          <CommentItem
            key={comment._id}
            comment={comment}
            albumId={albumId}
            fetchComments={fetchComments}
            replies={replies}
          />
        );
      })}
    </>
  ) : null;
};
