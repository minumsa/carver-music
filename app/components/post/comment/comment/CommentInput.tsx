import { useAtomValue, useSetAtom } from "jotai";
import styles from "./CommentInput.module.css";
import { commentsAtom, userIdAtom, userImageAtom, userNameAtom } from "@/app/modules/atoms";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { LoginAlert } from "../@common/LoginAlert";
import { postComment } from "@/app/modules/api/comment";
import { verifyLoginStatus } from "@/app/modules/api/auth";

interface CommentForm {
  userComment: string;
}

interface CommentInputProps {
  albumId: string;
}

export const CommentInput = ({ albumId }: CommentInputProps) => {
  const activeUserImage = useAtomValue(userImageAtom);
  const { handleSubmit, register, reset, watch } = useForm<CommentForm>({
    defaultValues: {
      userComment: "",
    },
  });
  const userId = useAtomValue(userIdAtom);
  const userName = useAtomValue(userNameAtom);
  const setComments = useSetAtom(commentsAtom);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const onSubmit = handleSubmit(async (data) => {
    const { userComment } = data;
    const postCommentParams = { userId, userName, userComment, albumId, date: new Date() };
    try {
      const response = await postComment(postCommentParams);
      reset();
      setComments(response.comments);
    } catch (error) {
      console.error(error, "Failed to post comments");
    }
  });

  const verifyLogin = async () => {
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
                onClick={verifyLogin}
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
