import { deleteComment } from "@/app/modules/api";
import styles from "../@common/ManageButtons.module.css";
import { Comment } from "@/app/modules/types";

interface CommentManageModalProps {
  userId: string;
  comment: Comment;
  showHandleModal: boolean;
  setShowHandleModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  fetchComments: any;
}

export const CommentManageButtons = ({
  userId,
  comment,
  showHandleModal,
  setShowHandleModal,
  setIsEditing,
  fetchComments,
}: CommentManageModalProps) => {
  const handleDeleteComment = async () => {
    const deleteParams = { userId, commentId: comment._id };
    await deleteComment(deleteParams);
    setShowHandleModal(false);
    await fetchComments();
  };

  return (
    showHandleModal && (
      <div className={styles.container}>
        <button
          className={styles.button}
          style={{ marginBottom: "-1px" }}
          onClick={() => {
            setIsEditing(true);
            setShowHandleModal(false);
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
