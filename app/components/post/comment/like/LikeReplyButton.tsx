import { Reply } from "@/app/modules/types";
import { LikeButton } from "./LikeButton";

interface LikeReplyButtonProps {
  reply: Reply;
}

export const LikeReplyButton = ({ reply }: LikeReplyButtonProps) => {
  return (
    <LikeButton
      albumId={reply.albumId}
      entityIdKey="reply"
      entityIdValue={reply._id}
      likedUserIds={reply.likedUserIds}
    />
  );
};
