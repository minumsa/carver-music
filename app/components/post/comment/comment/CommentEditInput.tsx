import { useAtomValue, useSetAtom } from "jotai";
import styles from "./CommentInput.module.css";
import { commentsAtom, userIdAtom, userImageAtom } from "@/app/modules/atoms";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { LoginAlert } from "../@common/LoginAlert";
import { Comment } from "@/app/modules/types";
import { editComment } from "@/app/modules/api/comment";
import { verifyLoginStatus } from "@/app/modules/api/auth";

interface CommentForm {
  userComment: string;
}

interface CommentInputProps {
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  comment: Comment;
}

export const CommentEditInput = ({ setIsEditing, comment }: CommentInputProps) => {
  const activeUserImage = useAtomValue(userImageAtom);
  const { handleSubmit, register, reset } = useForm<CommentForm>({
    defaultValues: {
      userComment: comment.userComment,
    },
  });
  const userId = useAtomValue(userIdAtom);
  const [showModal, setShowModal] = useState<boolean>(false);
  const setComments = useSetAtom(commentsAtom);

  const onSubmit = handleSubmit(async (data) => {
    const { userComment } = data;
    const commentId = comment._id;

    const commentParams = {
      albumId: comment.albumId,
      commentId,
      userId,
      userComment,
      date: new Date(),
    };
    try {
      const response = await editComment(commentParams);
      reset();
      setIsEditing(false);
      setComments(response.comments);
    } catch (error) {
      console.error(error, "Failed to sign up process");
    }
  });

  const handleTextareaClick = async () => {
    const { isLoggedIn } = await verifyLoginStatus();
    if (!isLoggedIn) setShowModal(true);
  };

  return (
    <>
      <LoginAlert showModal={showModal} setShowModal={setShowModal} />
      <div className={styles.container} onSubmit={onSubmit}>
        <div className={styles.commentContainer}>
          <div className={styles.userImageWrapper}>
            <img src={activeUserImage} alt="user-image" className={styles.userImage} />
          </div>
          <form className={styles.formContainer}>
            <div className={styles.textareaWrapper}>
              <textarea
                {...register("userComment")}
                className={styles.textarea}
                placeholder="댓글 작성"
                onClick={handleTextareaClick}
              />
            </div>
            <div className={styles.buttonWrapper}>
              <button
                className={styles.button}
                onClick={() => {
                  setIsEditing(false);
                }}
                style={{ marginRight: "-1px" }}
              >
                취소
              </button>
              <button className={styles.button} onClick={onSubmit}>
                수정
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
