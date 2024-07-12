import { useEffect, useState } from "react";
import { CommentResult } from "./Comment";
import { CommentInput } from "./CommentInput";
import styles from "./Comments.module.css";
import { getComment } from "@/app/modules/api";
import { Comment } from "@/app/modules/types";

interface CommentsProps {
  albumId: string;
}

export const Comments = ({ albumId }: CommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);

  const fetchComments = async () => {
    const response = await getComment(albumId);
    setComments(response.comments);
  };

  useEffect(() => {
    fetchComments();
  }, [albumId]);

  return (
    <div className={styles.commentContainer}>
      <CommentResult comments={comments} />
      <CommentInput albumId={albumId} fetchComments={fetchComments} />
    </div>
  );
};
