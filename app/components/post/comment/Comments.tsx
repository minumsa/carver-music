import { useEffect, useState } from "react";
import { CommentItems } from "./Comment";
import { CommentInput } from "./CommentInput";
import styles from "./Comments.module.css";
import { getComment } from "@/app/modules/api";
import { Comment, Reply } from "@/app/modules/types";

interface CommentsProps {
  albumId: string;
}

export const Comments = ({ albumId }: CommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);

  const fetchComments = async () => {
    const response = await getComment(albumId);
    setComments(response.comments);
    setReplies(response.replies);
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [albumId]);

  return (
    <div className={styles.container}>
      <CommentItems
        albumId={albumId}
        fetchComments={fetchComments}
        comments={comments}
        replies={replies}
      />
      <CommentInput albumId={albumId} fetchComments={fetchComments} />
    </div>
  );
};
