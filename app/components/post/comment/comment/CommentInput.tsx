import { useAtomValue } from "jotai";
import styles from "./CommentInput.module.css";
import { userIdAtom, userImageAtom, userNameAtom } from "@/app/modules/atoms";
import { useForm } from "react-hook-form";
import { checkUserLoginStatus, postComment } from "@/app/modules/api";
import { useState } from "react";
import { LoginAlert } from "../@common/LoginAlert";

interface CommentForm {
  userComment: string;
}

interface CommentInputProps {
  albumId: string;
  fetchComments: () => Promise<void>;
}

export const CommentInput = ({ albumId, fetchComments }: CommentInputProps) => {
  const currentUserImage = useAtomValue(userImageAtom);
  const { handleSubmit, register, reset, watch } = useForm<CommentForm>({
    defaultValues: {
      userComment: "",
    },
  });
  const userId = useAtomValue(userIdAtom);
  const userName = useAtomValue(userNameAtom);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const onSubmit = handleSubmit(async (data) => {
    const { userComment } = data;
    const postCommentParams = { userId, userName, userComment, albumId, date: new Date() };
    try {
      await postComment(postCommentParams);
      reset();
      await fetchComments();
    } catch (error) {
      console.error(error, "Failed to sign up process");
    }
  });

  const handleTextareaClick = async () => {
    const response = await checkUserLoginStatus();
    setIsLoggedIn(response.ok);
    if (!response.ok) setShowModal(true);
  };

  return (
    <>
      <LoginAlert showModal={showModal} setShowModal={setShowModal} />
      <div className={styles.container} onSubmit={onSubmit}>
        <div className={styles.commentContainer}>
          <div className={styles.userImageWrapper}>
            <img src={currentUserImage} alt="user-Image" className={styles.userImage} />
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
