export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class AlbumError extends ApiError {
  constructor(statusCode: number, message: string) {
    super(statusCode, message);
    this.name = "CommentError";
  }

  static fromResponse(response: Response) {
    switch (response.status) {
      case 403:
        return new AlbumError(response.status, "관리자 로그인 상태가 아닙니다.");
      case 404:
        return new AlbumError(response.status, "해당 앨범 데이터를 찾을 수 없습니다.");
      case 409:
        return new AlbumError(response.status, "이미 존재하는 앨범 데이터입니다.");
      default:
        return new AlbumError(response.status, "앨범 데이터 처리 중 시스템 오류가 발생했습니다.");
    }
  }
}

export class CommentError extends ApiError {
  constructor(statusCode: number, message: string) {
    super(statusCode, message);
    this.name = "CommentError";
  }

  static fromResponse(response: Response) {
    switch (response.status) {
      case 403:
        return new CommentError(response.status, "댓글 수정 권한이 없습니다.");
      case 404:
        return new CommentError(response.status, "해당 댓글을 찾을 수 없습니다.");
      default:
        return new CommentError(response.status, "댓글 처리 중 시스템 오류가 발생했습니다.");
    }
  }
}

export class ReplyError extends ApiError {
  constructor(statusCode: number, message: string) {
    super(statusCode, message);
    this.name = "ReplyError";
  }

  static fromResponse(response: Response) {
    switch (response.status) {
      case 403:
        return new ReplyError(response.status, "답글 수정 권한이 없습니다.");
      case 404:
        return new ReplyError(response.status, "해당 답글을 찾을 수 없습니다.");
      default:
        return new ReplyError(response.status, "답글 처리 중 시스템 오류가 발생했습니다.");
    }
  }
}

export class LikeError extends ApiError {
  constructor(statusCode: number, message: string) {
    super(statusCode, message);
    this.name = "LikeError";
  }

  static fromResponse(response: Response) {
    switch (response.status) {
      case 401:
        return new LikeError(response.status, "로그인 상태가 아닙니다.");
      case 404:
        return new LikeError(response.status, "해당 리소스를 찾을 수 없습니다.");
      default:
        return new LikeError(response.status, "좋아요 처리 중 시스템 오류가 발생했습니다.");
    }
  }
}

export class SignUpError extends ApiError {
  constructor(statusCode: number, message: string) {
    super(statusCode, message);
    this.name = "SignUpError";
  }

  static fromResponse(response: Response) {
    switch (response.status) {
      case 409:
        return new SignUpError(response.status, "이미 가입된 이메일입니다.");
      default:
        return new SignUpError(response.status, "회원가입 처리 중 시스템 오류가 발생했습니다.");
    }
  }
}

export class LoginError extends ApiError {
  constructor(statusCode: number, message: string) {
    super(statusCode, message);
    this.name = "LoginError";
  }

  static fromResponse(response: Response) {
    switch (response.status) {
      case 401:
        return new LoginError(response.status, "비밀번호가 일치하지 않습니다.");
      case 404:
        return new LoginError(response.status, "존재하지 않는 아이디입니다.");
      default:
        return new LoginError(response.status, "로그인 처리 중 시스템 오류가 발생했습니다.");
    }
  }
}

export class LogoutError extends ApiError {
  constructor(statusCode: number, message: string) {
    super(statusCode, message);
    this.name = "LogoutError";
  }

  static fromResponse(response: Response) {
    switch (response.status) {
      case 401:
        return new LogoutError(response.status, "유효하지 않은 토큰입니다.");
      case 404:
        return new LogoutError(response.status, "존재하지 않는 아이디입니다.");
      default:
        return new LogoutError(response.status, "로그아웃 처리 중 시스템 오류가 발생했습니다.");
    }
  }
}

export class GetLoginInfoError extends ApiError {
  constructor(statusCode: number, message: string) {
    super(statusCode, message);
    this.name = "GetLoginInfoError";
  }

  static fromResponse(response: Response) {
    switch (response.status) {
      case 401:
        return new GetLoginInfoError(response.status, "유효하지 않은 토큰입니다.");
      case 404:
        return new GetLoginInfoError(response.status, "존재하지 않는 아이디입니다.");
      default:
        return new GetLoginInfoError(
          response.status,
          "로그인 데이터 처리 중 시스템 오류가 발생했습니다.",
        );
    }
  }
}

export class SpotifyError extends ApiError {
  constructor(statusCode: number, message: string) {
    super(statusCode, message);
    this.name = "SpotifyError";
  }

  static fromResponse(response: Response) {
    switch (response.status) {
      default:
        return new SpotifyError(
          response.status,
          "스포티파이 데이터 처리 중 시스템 오류가 발생했습니다.",
        );
    }
  }
}
