import { deleteComment } from "@/app/modules/api/comment";
import styles from "../@common/ManageButtons.module.css";
import { Comment } from "@/app/modules/types";
import { useSetAtom } from "jotai";
import { commentsAtom } from "@/app/modules/atoms";

interface CommentManageModalProps {
  userId: string;
  comment: Comment;
  showHandleModal: boolean;
  setShowHandleModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CommentManageButtons = ({
  userId,
  comment,
  showHandleModal,
  setShowHandleModal,
  setIsEditing,
}: CommentManageModalProps) => {
  const setComments = useSetAtom(commentsAtom);

  const handleDeleteComment = async () => {
    const deleteParams = { albumId: comment.albumId, userId, commentId: comment._id };
    const response = await deleteComment(deleteParams);
    setShowHandleModal(false);
    setComments(response.comments);
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
