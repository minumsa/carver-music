import { useAtomValue } from "jotai";
import styles from "./Comment.module.css";
import { userIdAtom, userImageAtom } from "@/app/modules/atoms";
import { Comment, Reply } from "@/app/modules/types";
import React, { useState } from "react";
import { CommentEditInput } from "./CommentEditInput";
import { CommentManageButtons } from "./CommentManageButtons";
import { CommentHeart } from "./CommentHeart";
import { ReplyInput } from "./ReplyInput";
import { ReplyManageButtons } from "./ReplyManageButtons";
import { ReplyEditInput } from "./ReplyEditInput";
import { formatTimeDifference } from "@/app/modules/utils";
import { ReplyHeart } from "./ReplyHeart";

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
  const userImage = useAtomValue(userImageAtom);
  const { userId, userName, userComment, date } = comment;
  const dateDiff = formatTimeDifference(date);
  const [showCommentManageButtons, setShowCommentManageButtons] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const currentUserId = useAtomValue(userIdAtom);
  const isUserCommentOwner = userId === currentUserId;
  const commentId = comment._id;

  const [showReplyManageButtons, setShowReplyManageButtons] = useState<boolean>(true);
  const [showReplyModal, setShowReplyModal] = useState<boolean>(false);
  const [replyIsEditing, setReplyIsEditing] = useState<boolean>(false);
  const [activeReplyId, setActiveReplyId] = useState<string | null>();

  const handleComment = () => {
    setShowCommentManageButtons(!showCommentManageButtons);
  };

  const handleReply = (replyId: string) => {
    setActiveReplyId(replyId);
    setShowReplyManageButtons(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.commentContainer}>
        {isEditing ? null : (
          <div className={styles.userImageWrapper}>
            <img src={userImage} alt="user-Image" className={styles.userImage} />
          </div>
        )}
        <div className={styles.rightContainer}>
          {isEditing ? (
            <CommentEditInput
              fetchComments={fetchComments}
              comment={comment}
              setIsEditing={setIsEditing}
            />
          ) : (
            <>
              <div className={styles.detailWrapper}>
                <div>{`${userId} · ${dateDiff}`}</div>
                <div className={styles.commentRightDetailWrapper}>
                  {isUserCommentOwner && (
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
                <CommentHeart comment={comment} fetchComments={fetchComments} />
              </div>
            </>
          )}

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
                <div
                  className={`${styles.commentContainer} ${styles.replyBackground}`}
                  key={reply._id}
                >
                  <div className={styles.userImageWrapper}>
                    <img src={userImage} alt="user-Image" className={styles.userImage} />
                  </div>
                  <div className={styles.replyContainer}>
                    <div className={styles.detailWrapper}>
                      <div>{`${reply.userId} · ${formatTimeDifference(reply.date)}`}</div>
                      <div className={styles.commentRightDetailWrapper}>
                        {isUserCommentOwner && (
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
                        <span className={styles.commentUserId}>@{reply.commentUserId}</span>
                        <span>{reply.userComment}</span>
                      </div>
                    </form>
                    <div className={`${styles.detailWrapper} ${styles.replyHeartWrapper}`}>
                      {/* FIXME: 답글에 맞게 수정 */}
                      <ReplyHeart reply={reply} fetchComments={fetchComments} />
                    </div>
                    {/* {대댓글 input 자리} */}
                  </div>
                </div>
              ))
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
  const replycount = replies?.length;

  return comments ? (
    <div>
      <div className={styles.commentCount}>{`댓글 ${commentCount + replycount}`}</div>
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
