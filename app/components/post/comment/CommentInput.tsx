import { useAtomValue } from "jotai";
import styles from "./CommentInput.module.css";
import { userIdAtom, userImageAtom } from "@/app/modules/atoms";
import { useForm } from "react-hook-form";
import { checkUserLoginStatus, postComment } from "@/app/modules/api";
import { useState } from "react";
import { LoginAlert } from "./LoginAlert";

interface CommentForm {
  userComment: string;
}

interface CommentInputProps {
  albumId: string;
}

export const CommentInput = ({ albumId }: CommentInputProps) => {
  const currentUserImage = useAtomValue(userImageAtom);
  const { handleSubmit, register } = useForm<CommentForm>({
    defaultValues: {
      userComment: "",
    },
  });
  const userId = useAtomValue(userIdAtom);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const onSubmit = handleSubmit(async (data) => {
    const { userComment } = data;
    const postParams = { userId, userComment, albumId, date: new Date() };
    try {
      await postComment(postParams);
    } catch (error) {
      console.error(error, "Failed to sign up process");
    }
  });

  const handleTextareaClick = async () => {
    const response = await checkUserLoginStatus();
    if (response.ok) setIsLoggedIn(true);
    if (!isLoggedIn) setShowModal(true);
  };

  return (
    <>
      {showModal && <LoginAlert setShowModal={setShowModal} />}
      <div className={styles.container} onSubmit={onSubmit}>
        <div className={styles.commentCount}>{`${0}개의 댓글`}</div>
        <div className={styles.commentContainer}>
          <div className={styles.userImageWrapper}>
            <img src={currentUserImage} alt="user-Image" className={styles.userImage} />
          </div>
          <form className={styles.formContainer}>
            <div className={styles.textareaWrapper}>
              <textarea
                {...register("userComment")}
                className={styles.textarea}
                placeholder="Leave a comment"
                onClick={handleTextareaClick}
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
