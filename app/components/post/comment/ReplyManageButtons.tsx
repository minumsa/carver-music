import { deleteComment, deleteReply } from "@/app/modules/api";
import styles from "./CommentManageButtons.module.css";
import { Comment } from "@/app/modules/types";

interface ReplyManageModalProps {
  userId: string;
  reply: Comment;
  isActive: boolean;
  showReplyManageButtons: boolean;
  setShowReplyManageButtons: React.Dispatch<React.SetStateAction<boolean>>;
  handleReply: React.Dispatch<React.SetStateAction<string>>;
  setReplyIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  fetchComments: any;
}

export const ReplyManageButtons = ({
  userId,
  reply,
  isActive,
  showReplyManageButtons,
  setShowReplyManageButtons,
  handleReply,
  setReplyIsEditing,
  fetchComments,
}: ReplyManageModalProps) => {
  const replyId = reply._id;
  const handleDeleteReply = async () => {
    const deleteReplyParams = { userId, replyId };
    await deleteReply(deleteReplyParams);
    handleReply(replyId);
    await fetchComments();
  };

  return (
    isActive &&
    showReplyManageButtons && (
      <div className={styles.buttonContainer}>
        <button
          className={styles.button}
          style={{ marginBottom: "-1px" }}
          onClick={() => {
            setReplyIsEditing(true);
            handleReply(replyId);
            setShowReplyManageButtons(false);
          }}
        >
          수정
        </button>
        <button className={styles.button} onClick={handleDeleteReply}>
          삭제
        </button>
      </div>
    )
  );
};