import { toast } from "react-toastify";
import { BASE_URL } from "../constants/apiUrls";

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
      toast.error("시스템 오류로 댓글 등록에 실패했습니다.");
    } else {
      toast.success("댓글을 성공적으로 등록했습니다.");
    }

    return response;
  } catch (error) {
    console.error("Error: ", error);
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
      toast.error("시스템 오류로 답글 등록에 실패했습니다.");
    } else {
      toast.success("답글을 성공적으로 등록했습니다.");
    }

    return response;
  } catch (error) {
    console.error("Error: ", error);
  }
}

interface EditCommentParams {
  commentId: string;
  userId: string;
  userComment: string;
  date: Date;
}

export async function editComment(editParams: EditCommentParams) {
  try {
    const url = `${BASE_URL}/api/auth/comment`;
    const { commentId, userId, userComment, date } = editParams;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ commentId, userId, userComment, date }),
    });

    if (response.status === 403) {
      toast.warn("댓글 수정 권한이 없습니다.");
    } else if (response.status === 404) {
      toast.error("해당 댓글을 찾을 수 없습니다.");
    } else if (!response.ok) {
      toast.error("시스템 오류로 댓글 수정에 실패했습니다.");
    } else {
      toast.success("댓글을 성공적으로 수정했습니다.");
    }

    return response;
  } catch (error) {
    console.error("Error: ", error);
  }
}

export async function editReply(editParams: EditCommentParams) {
  try {
    const url = `${BASE_URL}/api/auth/comment/reply`;
    const { commentId, userId, userComment, date } = editParams;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ commentId, userId, userComment, date }),
    });

    if (response.status === 403) {
      toast.warn("댓글 수정 권한이 없습니다.");
    } else if (response.status === 404) {
      toast.error("해당 댓글을 찾을 수 없습니다.");
    } else if (!response.ok) {
      toast.error("시스템 오류로 댓글 수정에 실패했습니다.");
    } else {
      toast.success("댓글을 성공적으로 수정했습니다.");
    }

    return response;
  } catch (error) {
    console.error("Error: ", error);
  }
}

interface DeleteCommentParams {
  commentId: string;
  userId: string;
}

export async function deleteComment(deleteCommentParams: DeleteCommentParams) {
  try {
    const url = `${BASE_URL}/api/auth/comment`;
    const { userId, commentId } = deleteCommentParams;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ commentId, userId }),
    });

    if (response.status === 403) {
      toast.warn("댓글 삭제 권한이 없습니다.");
    } else if (response.status === 404) {
      toast.error("해당 댓글을 찾을 수 없습니다.");
    } else if (!response.ok) {
      toast.error("시스템 오류로 댓글 삭제에 실패했습니다.");
    } else {
      toast.success("댓글을 성공적으로 삭제했습니다.");
    }

    return response;
  } catch (error) {
    console.error("Error: ", error);
  }
}

interface DeleteReplyParams {
  replyId: string;
  userId: string;
}

export async function deleteReply(deleteReplyParams: DeleteReplyParams) {
  try {
    const url = `${BASE_URL}/api/auth/comment/reply`;
    const { userId, replyId } = deleteReplyParams;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ replyId, userId }),
    });

    if (response.status === 403) {
      toast.warn("답글 삭제 권한이 없습니다.");
    } else if (response.status === 404) {
      toast.error("해당 답글을 찾을 수 없습니다.");
    } else if (!response.ok) {
      toast.error("시스템 오류로 답글 삭제에 실패했습니다.");
    } else {
      toast.success("답글을 성공적으로 삭제했습니다.");
    }

    return response;
  } catch (error) {
    console.error("Error: ", error);
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

    return response.json();
  } catch (error) {
    console.error("Error: ", error);
  }
}

interface LikeToggleParams {
  entityIdKey: string;
  userId: string;
  likedUserIds: string[];
}

export async function likeCommentToggle(likeCommentToggleParams: LikeToggleParams) {
  try {
    const url = `${BASE_URL}/api/auth/comment/like`;
    const { entityIdKey, userId, likedUserIds } = likeCommentToggleParams;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ commentId: entityIdKey, userId, likedUserIds }),
    });

    if (response.status === 403) {
      console.error("댓글에 좋아요를 누를 권한이 없습니다.");
    } else if (response.status === 404) {
      console.error("해당 댓글을 찾을 수 없습니다.");
    } else if (!response.ok) {
      console.error("시스템 오류로 좋아요 반영에 실패했습니다.");
    }

    return response;
  } catch (error) {
    console.error("Error: ", error);
  }
}

export async function likeReplyToggle(likeReplyToggleParams: LikeToggleParams) {
  try {
    const url = `${BASE_URL}/api/auth/comment/reply/like`;
    const { entityIdKey, userId, likedUserIds } = likeReplyToggleParams;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ replyId: entityIdKey, userId, likedUserIds }),
    });

    if (response.status === 403) {
      console.error("댓글에 좋아요를 누를 권한이 없습니다.");
    } else if (response.status === 404) {
      console.error("해당 댓글을 찾을 수 없습니다.");
    } else if (!response.ok) {
      console.error("시스템 오류로 좋아요 반영에 실패했습니다.");
    }

    return response.json();
  } catch (error) {
    console.error("Error: ", error);
  }
}
