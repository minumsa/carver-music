export interface UserLoginResult {
  message: string;
  role: string;
}

export interface VerifyLoginResult {
  message: string;
  isLoggedIn: boolean;
}

export interface UserInfoResult {
  login: boolean;
  userId: string;
  userName: string;
  userImage: string;
  role: string;
}
