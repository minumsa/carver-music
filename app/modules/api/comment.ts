import { toast } from "react-toastify";
import { BASE_URL } from "../constants/apiUrls";
import { ApiError, CommentError, LikeError, ReplyError } from "../errors";

interface PostCommentParams {
  userId: string;
  userName: string;
  userComment: string;
  albumId: string;
  date: Date;
}

export async function postComment(postCommentParams: PostCommentParams) {
  try {
    const url = `${BASE_URL}/api/auth/comment`;
    const { userId, userName, userComment, albumId, date } = postCommentParams;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        userName,
        userComment,
        albumId,
        date,
      }),
    });

    if (!response.ok) {
      const error = CommentError.fromResponse(response);
      toast.error(error.message);
      throw error;
    }

    return response.json();
  } catch (error) {
    if (!(error instanceof CommentError)) {
      const systemErrorMessage = "댓글 처리 중 시스템 오류가 발생했습니다.";
      toast.error(systemErrorMessage);
      throw new Error(systemErrorMessage);
    }
    throw error;
  }
}

interface PostReplyParams extends PostCommentParams {
  commentId: string;
  commentUserId: string;
}

export async function postReply(postReplyParams: PostReplyParams) {
  try {
    const url = `${BASE_URL}/api/auth/comment/reply`;
    const { commentId, commentUserId, userId, userName, userComment, albumId, date } =
      postReplyParams;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        commentId,
        commentUserId,
        userId,
        userName,
        userComment,
        albumId,
        date,
      }),
    });

    if (!response.ok) {
      const error = ReplyError.fromResponse(response);
      toast.error(error.message);
      throw error;
    }

    return response.json();
  } catch (error) {
    if (!(error instanceof ReplyError)) {
      const systemErrorMessage = "답글 처리 중 시스템 오류가 발생했습니다.";
      toast.error(systemErrorMessage);
      throw new Error(systemErrorMessage);
    }
    throw error;
  }
}

interface EditCommentParams {
  albumId: string;
  commentId: string;
  userId: string;
  userComment: string;
  date: Date;
}

export async function editComment(editParams: EditCommentParams) {
  try {
    const url = `${BASE_URL}/api/auth/comment`;
    const { albumId, commentId, userId, userComment, date } = editParams;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ albumId, commentId, userId, userComment, date }),
    });

    if (!response.ok) {
      const error = CommentError.fromResponse(response);
      toast.error(error.message);
      throw error;
    }

    return response.json();
  } catch (error) {
    if (!(error instanceof CommentError)) {
      const systemErrorMessage = "댓글 처리 중 시스템 오류가 발생했습니다.";
      toast.error(systemErrorMessage);
      throw new Error(systemErrorMessage);
    }
    throw error;
  }
}

export async function editReply(editParams: EditCommentParams) {
  try {
    const url = `${BASE_URL}/api/auth/comment/reply`;
    const { albumId, commentId, userId, userComment, date } = editParams;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ albumId, commentId, userId, userComment, date }),
    });

    if (!response.ok) {
      const error = ReplyError.fromResponse(response);
      toast.error(error.message);
      throw error;
    }

    return response.json();
  } catch (error) {
    if (!(error instanceof ReplyError)) {
      const systemErrorMessage = "답글 처리 중 시스템 오류가 발생했습니다.";
      toast.error(systemErrorMessage);
      throw new Error(systemErrorMessage);
    }
    throw error;
  }
}

interface DeleteCommentParams {
  albumId: string;
  commentId: string;
  userId: string;
}

export async function deleteComment(deleteCommentParams: DeleteCommentParams) {
  try {
    const url = `${BASE_URL}/api/auth/comment`;
    const { albumId, userId, commentId } = deleteCommentParams;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ albumId, commentId, userId }),
    });

    if (!response.ok) {
      const error = CommentError.fromResponse(response);
      toast.error(error.message);
      throw error;
    }

    return response.json();
  } catch (error) {
    if (!(error instanceof CommentError)) {
      const systemErrorMessage = "댓글 처리 중 시스템 오류가 발생했습니다.";
      toast.error(systemErrorMessage);
      throw new Error(systemErrorMessage);
    }
    throw error;
  }
}

interface DeleteReplyParams {
  albumId: string;
  replyId: string;
  userId: string;
}

export async function deleteReply(deleteReplyParams: DeleteReplyParams) {
  try {
    const url = `${BASE_URL}/api/auth/comment/reply`;
    const { albumId, userId, replyId } = deleteReplyParams;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ albumId, replyId, userId }),
    });

    if (!response.ok) {
      const error = ReplyError.fromResponse(response);
      toast.error(error.message);
      throw error;
    }

    return response.json();
  } catch (error) {
    if (!(error instanceof ReplyError)) {
      const systemErrorMessage = "댓글 처리 중 시스템 오류가 발생했습니다.";
      toast.error(systemErrorMessage);
      throw new Error(systemErrorMessage);
    }
    throw error;
  }
}

export async function getComment(albumId: string) {
  try {
    const queryString = `?albumId=${albumId}`;
    const url = `${BASE_URL}/api/auth/comment${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = CommentError.fromResponse(response);
      toast.error(error.message);
      throw error;
    }

    return response.json();
  } catch (error) {
    if (!(error instanceof CommentError)) {
      const systemErrorMessage = "댓글 처리 중 시스템 오류가 발생했습니다.";
      toast.error(systemErrorMessage);
      throw new Error(systemErrorMessage);
    }
    throw error;
  }
}

interface LikeToggleParams {
  albumId: string;
  entityIdKey: string;
  userId: string;
  likedUserIds: string[];
}

export async function likeCommentToggle(likeCommentToggleParams: LikeToggleParams) {
  try {
    const url = `${BASE_URL}/api/auth/comment/like`;
    const { albumId, entityIdKey, userId, likedUserIds } = likeCommentToggleParams;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ albumId, commentId: entityIdKey, userId, likedUserIds }),
    });

    if (!response.ok) {
      const error = LikeError.fromResponse(response);
      toast.error(error.message);
      throw error;
    }

    return response.json();
  } catch (error) {
    if (!(error instanceof LikeError)) {
      const systemErrorMessage = "좋아요 처리 중 시스템 오류가 발생했습니다.";
      toast.error(systemErrorMessage);
      throw new Error(systemErrorMessage);
    }
    throw error;
  }
}

export async function likeReplyToggle(likeReplyToggleParams: LikeToggleParams) {
  const url = `${BASE_URL}/api/auth/comment/reply/like`;
  const { albumId, entityIdKey, userId, likedUserIds } = likeReplyToggleParams;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ albumId, replyId: entityIdKey, userId, likedUserIds }),
    });

    if (!response.ok) {
      const error = LikeError.fromResponse(response);
      toast.error(error.message);
      throw error;
    }

    return response.json();
  } catch (error) {
    if (!(error instanceof LikeError)) {
      const systemErrorMessage = "좋아요 처리 중 시스템 오류가 발생했습니다.";
      toast.error(systemErrorMessage);
      throw new Error(systemErrorMessage);
    }
    throw error;
  }
}
