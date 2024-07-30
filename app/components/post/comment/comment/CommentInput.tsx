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
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const onSubmit = handleSubmit(async (data) => {
    const { userComment } = data;
    const postCommentParams = { userId, userName, userComment, albumId, date: new Date() };
    try {
      const { comments } = await postComment(postCommentParams);
      reset();
      setComments(comments);
    } catch (error) {
      console.error(error, "Failed to post comments");
    }
  });

  const verifyLogin = async () => {
    const response = await verifyLoginStatus();
    setIsLoggedIn(response.isLoggedIn);
    if (!response.isLoggedIn) setShowLoginModal(true);
  };

  return (
    <>
      <LoginAlert showLoginModal={showLoginModal} setShowLoginModal={setShowLoginModal} />
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
