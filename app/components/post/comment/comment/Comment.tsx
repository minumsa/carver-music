import { useAtom, useAtomValue } from "jotai";
import styles from "./Comment.module.css";
import { commentsAtom, repliesAtom, userIdAtom } from "@/app/modules/atoms";
import { Comment, Reply } from "@/app/modules/types";
import React, { useState } from "react";
import { CommentEditInput } from "./CommentEditInput";
import { CommentManageButtons } from "./CommentManageButtons";
import { LikeCommentButton } from "../like/LikeCommentButton";
import { ReplyInput } from "../reply/ReplyInput";
import { ReplyManageButtons } from "../reply/ReplyManageButtons";
import { ReplyEditingInput } from "../reply/ReplyEditInput";
import { formatTimeDifference } from "@/app/modules/utils";
import { LikeReplyButton } from "../like/LikeReplyButton";

interface CommentItemProps {
  comment: Comment;
  albumId: string;
}

// 댓글 - comment, 답글 - reply
export const CommentItem = ({ comment, albumId }: CommentItemProps) => {
  const { userId, userName, userComment, date, userImage } = comment;
  const dateDiff = formatTimeDifference(date);
  const [showCommentManageButtons, setShowCommentManageButtons] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const activeUserId = useAtomValue(userIdAtom);
  const commentId = comment._id;
  const [showReplyManageButtons, setShowReplyManageButtons] = useState<boolean>(false);
  const [showReplyInput, setShowReplyInput] = useState<boolean>(false);
  const [showReplyEditingInput, setShowReplyEditingInput] = useState<boolean>(false);
  const [activeReplyId, setActiveReplyId] = useState<string | null>();
  const commentHeaderLabel = `${userName} · ${dateDiff}`;
  const isUserCommentOwner = activeUserId === comment.userId;
  const replies = useAtomValue(repliesAtom);

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
        <CommentEditInput comment={comment} setIsEditing={setIsEditing} />
      ) : (
        <div className={styles.commentContainer}>
          <div className={styles.userImageWrapper}>
            <img src={userImage} alt="user-image" className={styles.userImage} />
          </div>
          <div className={styles.rightContainer}>
            <div className={styles.detailWrapper}>
              <p>{commentHeaderLabel}</p>
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
                />
              </div>
            </div>
            <form className={styles.formContainer}>
              <div className={styles.textareaWrapper}>{userComment}</div>
            </form>
            <div className={styles.detailWrapper}>
              <button
                onClick={() => {
                  setShowReplyInput(!showReplyInput);
                }}
                className={styles.button}
              >
                답글
              </button>
              <LikeCommentButton comment={comment} />
            </div>
          </div>
        </div>
      )}

      {showReplyInput && (
        <ReplyInput comment={comment} albumId={albumId} setShowReplyInput={setShowReplyInput} />
      )}

      {replies.map((reply) => {
        const isReply = commentId === reply.commentId;
        const isActiveReply = activeReplyId === reply._id;
        const replyDetails = `${reply.userName} · ${formatTimeDifference(reply.date)}`;
        const isUserReplyOwner = activeUserId === reply.userId;
        return (
          isReply &&
          (isActiveReply && showReplyEditingInput ? (
            <ReplyEditingInput
              key={reply._id}
              reply={reply}
              setShowReplyEditingInput={setShowReplyEditingInput}
            />
          ) : (
            <div className={styles.commentContainer} key={reply._id}>
              <div className={styles.replyBackground}>
                <div className={styles.userImageWrapper}>
                  <img src={reply.userImage} alt="user-image" className={styles.userImage} />
                </div>
                <div className={styles.replyContainer}>
                  <div className={styles.detailWrapper}>
                    <p>{replyDetails}</p>
                    <div className={styles.commentRightDetailWrapper}>
                      {isUserReplyOwner && (
                        <button onClick={() => handleReply(reply._id)}>···</button>
                      )}
                      <ReplyManageButtons
                        userId={userId}
                        reply={reply}
                        isActive={activeReplyId === reply._id}
                        showReplyManageButtons={showReplyManageButtons}
                        setShowReplyManageButtons={setShowReplyManageButtons}
                        handleReply={() => handleReply(reply._id)}
                        setReplyIsEditing={setShowReplyEditingInput}
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
                    <LikeReplyButton reply={reply} />
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
  albumId: string;
}

export const CommentList = ({ albumId }: CommentResultProps) => {
  const comments = useAtomValue(commentsAtom);
  const replies = useAtomValue(repliesAtom);
  const commentSummaryCount = `댓글 ${comments.length + replies.length}`;

  return (
    <>
      <div className={styles.commentCount}>{commentSummaryCount}</div>
      {comments.map((comment: Comment) => {
        return <CommentItem key={comment._id} comment={comment} albumId={albumId} />;
      })}
    </>
  );
};
