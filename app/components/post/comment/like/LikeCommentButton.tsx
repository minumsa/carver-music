import { Comment } from "@/app/modules/types";
import { LikeButton } from "./LikeButton";

interface LikeCommentButtonProps {
  comment: Comment;
}

export const LikeCommentButton = ({ comment }: LikeCommentButtonProps) => {
  return (
    <LikeButton
      albumId={comment.albumId}
      entityIdKey="comment"
      entityIdValue={comment._id}
      likedUserIds={comment.likedUserIds}
    />
  );
};
