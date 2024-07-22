import { toast } from "react-toastify";
import { validateEmail, validatePassword, validateUserId, validateUserName } from "../utils";
import { verify } from "jsonwebtoken";
import { BASE_URL } from "../constants/apiUrls";

export async function userSignUp(
  userId: string,
  userName: string,
  email: string,
  password: string,
) {
  try {
    if (!validateUserId(userId)) {
      toast.error(
        "사용자 아이디는 영어 소문자와 숫자만 입력 가능하고 최소 3자, 최대 15자여야 합니다. 🙀",
      );
      return;
    }

    if (!validateUserName(userName)) {
      toast.error("닉네임은 영어, 한글, 숫자만 입력 가능하고 최소 2자, 최대 10자여야 합니다. 🙀");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("유효하지 않은 이메일 형식입니다. 🙀");
      return;
    }

    if (!validatePassword(password)) {
      toast.error("비밀번호는 최소 10자 이상이어야 하며, 특수문자를 포함해야 합니다. 🙀");
      return;
    }

    // 회원가입 API 호출
    const url = `${BASE_URL}/api/auth/signup`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        userName,
        email,
        password,
      }),
    });

    if (response.status === 422) {
      toast.error("이미 가입된 이메일입니다. 🙀");
    } else if (!response.ok) {
      toast.error("회원가입에 실패했습니다. 😿");
    } else {
      toast.success("회원가입에 성공했습니다. 😻");
    }

    return response;
  } catch (error) {
    console.error("Error: ", error);
    toast.error("회원가입 과정에서 오류가 발생했습니다. 😿");
  }
}

export async function userLogin(id: string, password: string) {
  try {
    const url = `${BASE_URL}/api/auth/login`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: id,
        password,
      }),
    });

    if (!response.ok) {
      toast.error("로그인에 실패했습니다. 😿");
    } else {
      toast.success("로그인에 성공했습니다. 😻");
    }

    return response;
  } catch (error) {
    console.error("Error: ", error);
  }
}

export async function getUserInfo() {
  try {
    const url = `${BASE_URL}/api/auth/login`;

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

export function parseCookies(cookieHeader: string): Record<string, string> {
  return cookieHeader.split(";").reduce(
    (cookies, cookie) => {
      const [name, ...rest] = cookie.split("=");
      cookies[name.trim()] = rest.join("=").trim();
      return cookies;
    },
    {} as Record<string, string>,
  );
}

export async function isAdminLoggedIn(request: Request): Promise<boolean> {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");
  const JWT_SECRET = process.env.JWT_SECRET;

  try {
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) {
      return false;
    }

    const cookies = parseCookies(cookieHeader);
    const loginToken = cookies["loginToken"];
    if (!loginToken) {
      return false;
    }

    const decoded: any = verify(loginToken, JWT_SECRET);

    if (!decoded || decoded.role !== "admin") {
      return false;
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function verifyLoginStatus() {
  try {
    const url = `${BASE_URL}/api/auth/checkLogin`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.json();
  } catch (error) {
    console.error("Error checking login status:", error);
    return false;
  }
}

export async function userLogout() {
  try {
    const url = `${BASE_URL}/api/auth/logout`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to logout");
    }

    window.location.reload();
  } catch (error) {
    console.error("Error checking login status:", error);
    return false;
  }
}
