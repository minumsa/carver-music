import { Reply } from "@/app/modules/types";
import { LikeButton } from "./LikeButton";

interface LikeReplyButtonProps {
  reply: Reply;
  fetchComments: () => Promise<void>;
}

export const LikeReplyButton = ({ reply, fetchComments }: LikeReplyButtonProps) => {
  return (
    <LikeButton
      entityIdKey="replyId"
      entityIdValue={reply._id}
      likedUserIds={reply.likedUserIds}
      fetchComments={fetchComments}
    />
  );
};
