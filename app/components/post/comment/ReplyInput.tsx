import { useAtomValue } from "jotai";
import styles from "./ReplyInput.module.css";
import { userIdAtom, userImageAtom, userNameAtom } from "@/app/modules/atoms";
import { useForm } from "react-hook-form";
import { checkUserLoginStatus, postReply } from "@/app/modules/api";
import { useState } from "react";
import { LoginAlert } from "./LoginAlert";
import { Comment } from "@/app/modules/types";

interface CommentForm {
  userComment: string;
}

interface ReplyInputProps {
  comment: Comment;
  albumId: string;
  fetchComments: any;
  setShowReplyModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ReplyInput = ({
  comment,
  albumId,
  fetchComments,
  setShowReplyModal,
}: ReplyInputProps) => {
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
      await postReply(postReplyParams);
      setShowReplyModal(false);
      reset();
      await fetchComments();
    } catch (error) {
      console.error(error, "Failed to sign up process");
    }
  });

  const handleTextareaClick = async () => {
    const response = await checkUserLoginStatus();
    setIsLoggedIn(response.ok);
    if (!response.ok) setShowLoginModal(true);
  };

  return (
    <>
      <LoginAlert showModal={showLoginModal} setShowModal={setShowLoginModal} />
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
