import { useAtomValue, useSetAtom } from "jotai";
import styles from "./ReplyInput.module.css";
import {
  commentsAtom,
  repliesAtom,
  userIdAtom,
  userImageAtom,
  userNameAtom,
} from "@/app/modules/atoms";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { LoginAlert } from "../@common/LoginAlert";
import { Comment } from "@/app/modules/types";
import { postReply } from "@/app/modules/api/comment";
import { verifyLoginStatus } from "@/app/modules/api/auth";
import { toast } from "react-toastify";

interface CommentForm {
  userComment: string;
}

interface ReplyInputProps {
  comment: Comment;
  albumId: string;
  setShowReplyInput: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ReplyInput = ({ comment, albumId, setShowReplyInput }: ReplyInputProps) => {
  const setComments = useSetAtom(commentsAtom);
  const setReplies = useSetAtom(repliesAtom);
  const currentUserImage = useAtomValue(userImageAtom);
  const { handleSubmit, register, reset, watch } = useForm<CommentForm>({
    defaultValues: {
      userComment: "",
    },
  });
  const userId = useAtomValue(userIdAtom);
  const userName = useAtomValue(userNameAtom);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const onSubmit = handleSubmit(async (data) => {
    const { userComment } = data;
    const postReplyParams = {
      commentId: comment._id,
      commentUserId: comment.userId,
      userId,
      userName,
      userComment,
      albumId,
      date: new Date(),
    };
    try {
      const response = await postReply(postReplyParams);
      setShowReplyInput(false);
      reset();
      setComments(response.comments);
      setReplies(response.replies);
    } catch (error) {
      toast.error("답글을 제출하는 데 실패했습니다.");
    }
  });

  const handleTextareaClick = async () => {
    const response = await verifyLoginStatus();
    setIsLoggedIn(response.ok);
    if (!response.ok) setShowLoginModal(true);
  };

  return (
    <>
      <LoginAlert showModal={showLoginModal} setShowModal={setShowLoginModal} />
      <div className={styles.container} onSubmit={onSubmit}>
        <div className={styles.commentContainer}>
          <div className={styles.userImageWrapper}>
            <img src={currentUserImage} alt="user-image" className={styles.userImage} />
          </div>
          <form className={styles.formContainer}>
            <div className={styles.textareaWrapper}>
              <textarea
                {...register("userComment")}
                className={styles.textarea}
                placeholder="댓글 작성"
                onClick={handleTextareaClick}
                value={isLoggedIn ? watch("userComment") : ""}
              />
            </div>
            <button className={styles.button} onClick={onSubmit}>
              제출하기
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
