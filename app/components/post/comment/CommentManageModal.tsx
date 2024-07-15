import { deleteComment } from "@/app/modules/api";
import styles from "./CommentManageModal.module.css";
import { Comment } from "@/app/modules/types";

interface CommentManageModalProps {
  userId: string;
  comment: Comment;
  showHandleCommentModal: boolean;
  setShowHandleCommentModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  fetchComments: any;
}

export const CommentManageModal = ({
  userId,
  comment,
  showHandleCommentModal,
  setShowHandleCommentModal,
  setIsEditing,
  fetchComments,
}: CommentManageModalProps) => {
  const handleDeleteComment = async () => {
    const deleteParams = { userId, commentId: comment._id };
    await deleteComment(deleteParams);
    setShowHandleCommentModal(false);
    await fetchComments();
  };

  return (
    showHandleCommentModal && (
      <div className={styles.buttonContainer}>
        <button
          className={styles.button}
          style={{ marginBottom: "-1px" }}
          onClick={() => {
            setIsEditing(true);
            setShowHandleCommentModal(false);
          }}
        >
          수정
        </button>
        <button className={styles.button} onClick={handleDeleteComment}>
          삭제
        </button>
      </div>
    )
  );
};
