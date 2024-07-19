import { useAtomValue } from "jotai";
import styles from "./ReplyInput.module.css";
import { userIdAtom, userImageAtom } from "@/app/modules/atoms";
import { useForm } from "react-hook-form";
import { checkUserLoginStatus, editReply } from "@/app/modules/api";
import { useState } from "react";
import { LoginAlert } from "../@common/LoginAlert";
import { Reply } from "@/app/modules/types";

interface ReplyForm {
  userComment: string;
}

interface ReplyInputProps {
  fetchComments: any;
  setReplyIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  reply: Reply;
}

export const ReplyEditInput = ({ fetchComments, setReplyIsEditing, reply }: ReplyInputProps) => {
  const currentUserImage = useAtomValue(userImageAtom);
  const { handleSubmit, register, reset } = useForm<ReplyForm>({
    defaultValues: {
      userComment: reply.userComment,
    },
  });
  const userId = useAtomValue(userIdAtom);
  const [showModal, setShowModal] = useState<boolean>(false);

  const onSubmit = handleSubmit(async (data) => {
    const { userComment } = data;
    const commentId = reply._id;

    const commentParams = { commentId, userId, userComment, date: new Date() };
    try {
      await editReply(commentParams);
      reset();
      setReplyIsEditing(false);
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
              />
            </div>
            <div className={styles.buttonWrapper}>
              <button
                className={styles.button}
                onClick={() => {
                  setReplyIsEditing(false);
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
