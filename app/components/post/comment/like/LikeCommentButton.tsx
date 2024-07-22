import { Comment } from "@/app/modules/types";
import { LikeButton } from "./LikeButton";

interface LikeCommentButtonProps {
  comment: Comment;
  fetchComments: () => Promise<void>;
}

export const LikeCommentButton = ({ comment, fetchComments }: LikeCommentButtonProps) => {
  return (
    <LikeButton
      entityIdKey="comment"
      entityIdValue={comment._id}
      likedUserIds={comment.likedUserIds}
      fetchComments={fetchComments}
    />
  );
};
