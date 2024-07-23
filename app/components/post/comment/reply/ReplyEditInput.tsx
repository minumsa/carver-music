import { useAtomValue, useSetAtom } from "jotai";
import styles from "./ReplyInput.module.css";
import { commentsAtom, repliesAtom, userIdAtom, userImageAtom } from "@/app/modules/atoms";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { LoginAlert } from "../@common/LoginAlert";
import { Reply } from "@/app/modules/types";
import { editReply } from "@/app/modules/api/comment";
import { verifyLoginStatus } from "@/app/modules/api/auth";

interface ReplyForm {
  userComment: string;
}

interface ReplyInputProps {
  setShowReplyEditingInput: React.Dispatch<React.SetStateAction<boolean>>;
  reply: Reply;
}

export const ReplyEditingInput = ({ setShowReplyEditingInput, reply }: ReplyInputProps) => {
  const setComments = useSetAtom(commentsAtom);
  const setReplies = useSetAtom(repliesAtom);
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

    const commentParams = {
      albumId: reply.albumId,
      commentId,
      userId,
      userComment,
      date: new Date(),
    };
    try {
      const response = await editReply(commentParams);
      reset();
      setShowReplyEditingInput(false);
      setComments(response.comments);
      setReplies(response.replies);
    } catch (error) {
      console.error(error, "Failed to sign up process");
    }
  });

  const handleTextareaClick = async () => {
    const response = await verifyLoginStatus();
    const isLoggedIn = response.ok;
    if (!isLoggedIn) setShowModal(true);
  };

  return (
    <>
      <LoginAlert showModal={showModal} setShowModal={setShowModal} />
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
              />
            </div>
            <div className={styles.buttonWrapper}>
              <button
                className={styles.button}
                onClick={() => {
                  setShowReplyEditingInput(false);
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
