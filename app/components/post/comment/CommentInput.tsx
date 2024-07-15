import { useAtomValue } from "jotai";
import styles from "./CommentInput.module.css";
import { userIdAtom, userImageAtom, userNameAtom } from "@/app/modules/atoms";
import { useForm } from "react-hook-form";
import { checkUserLoginStatus, postComment } from "@/app/modules/api";
import { useState } from "react";
import { LoginAlert } from "./LoginAlert";

interface CommentForm {
  userComment: string;
}

interface CommentInputProps {
  albumId: string;
  fetchComments: any;
}

export const CommentInput = ({ albumId, fetchComments }: CommentInputProps) => {
  const currentUserImage = useAtomValue(userImageAtom);
  const { handleSubmit, register, reset } = useForm<CommentForm>({
    defaultValues: {
      userComment: "",
    },
  });
  const userId = useAtomValue(userIdAtom);
  const userName = useAtomValue(userNameAtom);
  const [showModal, setShowModal] = useState<boolean>(false);

  const onSubmit = handleSubmit(async (data) => {
    const { userComment } = data;
    const postParams = { userId, userName, userComment, albumId, date: new Date() };
    try {
      await postComment(postParams);
      reset();
      await fetchComments();
    } catch (error) {
      console.error(error, "Failed to sign up process");
    }
  });

  const handleTextareaClick = async () => {
    const response = await checkUserLoginStatus();
    const isLoggedIn = response.ok;
    if (!isLoggedIn) setShowModal(true);
  };

  return (
    <>
      {showModal && <LoginAlert setShowModal={setShowModal} />}
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
