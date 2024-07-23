import { useCallback, useEffect, useState } from "react";
import { CommentList } from "./comment/Comment";
import { CommentInput } from "./comment/CommentInput";
import styles from "./Comments.module.css";
import { Comment, Reply } from "@/app/modules/types";
import { getComment } from "@/app/modules/api/comment";
import { useAtom, useSetAtom } from "jotai";
import { commentsAtom, repliesAtom } from "@/app/modules/atoms";
import { toast } from "react-toastify";

interface CommentsProps {
  albumId: string;
}

export const Comments = ({ albumId }: CommentsProps) => {
  const setComments = useSetAtom(commentsAtom);
  const setReplies = useSetAtom(repliesAtom);

  const fetchComments = useCallback(async (): Promise<void> => {
    try {
      const response = await getComment(albumId);
      setComments(response.comments);
      setReplies(response.replies);
    } catch (error) {
      toast.error("댓글 데이터를 불러오는 데 실패했습니다.");
    }
    // jotai의 useSetAtom을 의존성 배열에 추가하라는 알림 무시
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [albumId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return (
    <div className={styles.container}>
      <CommentList albumId={albumId} />
      <CommentInput albumId={albumId} />
    </div>
  );
};
