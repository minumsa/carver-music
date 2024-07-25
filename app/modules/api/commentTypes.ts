export interface PostCommentParams {
  userId: string;
  userName: string;
  userComment: string;
  albumId: string;
  date: Date;
}

export interface PostReplyParams extends PostCommentParams {
  commentId: string;
  commentUserId: string;
}

export interface EditCommentParams {
  albumId: string;
  commentId: string;
  userId: string;
  userComment: string;
  date: Date;
}

export interface DeleteCommentParams {
  albumId: string;
  commentId: string;
  userId: string;
}

export interface DeleteReplyParams {
  albumId: string;
  replyId: string;
  userId: string;
}

export interface LikeToggleParams {
  albumId: string;
  entityIdKey: string;
  userId: string;
  likedUserIds: string[];
}
