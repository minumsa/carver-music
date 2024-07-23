import { useCallback, useEffect, useState } from "react";
import { CommentList } from "./comment/Comment";
import { CommentInput } from "./comment/CommentInput";
import styles from "./Comments.module.css";
import { Comment, Reply } from "@/app/modules/types";
import { getComment } from "@/app/modules/api/comment";

interface CommentsProps {
  albumId: string;
}

export const Comments = ({ albumId }: CommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);

  const fetchComments = useCallback(async (): Promise<void> => {
    const response = await getComment(albumId);
    setComments(response.comments);
    setReplies(response.replies);
  }, [albumId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return (
    <div className={styles.container}>
      <CommentList
        albumId={albumId}
        fetchComments={fetchComments}
        comments={comments}
        replies={replies}
      />
      <CommentInput albumId={albumId} fetchComments={fetchComments} />
    </div>
  );
};
