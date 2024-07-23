"use client";

import styles from "./Login.module.css";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { userIdAtom, userImageAtom, userNameAtom } from "@/app/modules/atoms";
import { getUserInfo, userLogin } from "@/app/modules/api/auth";
import { getRedirectPathForAdmin, getRedirectPathForUser } from "@/app/modules/paths";

require("dotenv").config();

interface LoginForm {
  id: string;
  password: string;
}

export const Login = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<LoginForm>({
    defaultValues: {
      id: "",
      password: "",
    },
  });
  const [prevURL, setPrevURL] = useState<URL>();
  const setCurrentUserName = useSetAtom(userNameAtom);
  const setCurrentUserImage = useSetAtom(userImageAtom);
  const setCurrentUserId = useSetAtom(userIdAtom);

  const getDefaultRedirectPath = (role: string) => {
    if (role === "admin") {
      return "/admin";
    } else {
      return "/";
    }
  };

  const getLoginRedirectPath = (role: string, baseURL: string, prevURL?: URL) => {
    if (!prevURL) return getDefaultRedirectPath(role);

    const prevURLString = prevURL.toString();
    const isBaseURLPresent = prevURLString.includes(baseURL) && !prevURLString.includes("signup");
    const isAdminURL = prevURLString.includes("admin");

    if (isBaseURLPresent) {
      if (role === "admin") {
        return getRedirectPathForAdmin(baseURL, isAdminURL, prevURL);
      } else if (role === "user") {
        return getRedirectPathForUser(baseURL, prevURL);
      }
    } else {
      return getDefaultRedirectPath(role);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    const { id, password } = data;
    try {
      await userLogin(id, password);
      const response = await getUserInfo();
      const { userId, userName, userImage, role } = response;
      setCurrentUserName(userName);
      setCurrentUserImage(userImage);
      setCurrentUserId(userId);
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
      if (baseURL) {
        const redirectURL = getLoginRedirectPath(role, baseURL, prevURL);
        if (redirectURL) router.push(redirectURL);
      }
    } catch (error) {
      console.error(error, "Failed to sign up process");
    }
  });

  useEffect(() => {
    // 이전 페이지의 전체 URL을 가져오기
    const referrer = document.referrer;

    if (referrer) {
      const url = new URL(referrer);
      setPrevURL(url);
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h3>로그인</h3>
        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.item}>
            <label className={styles.label}>아이디</label>
            <input className={styles.input} {...register("id")} required />
          </div>
          <div className={styles.item}>
            <label className={styles.label}>비밀번호</label>
            <input className={styles.input} {...register("password")} type="password" required />
          </div>
        </form>
        <div className={styles.buttonContainer}>
          <button
            onClick={() => {
              router.push("/signup");
            }}
            className={styles.button}
            style={{ marginRight: "-1px" }}
          >
            회원가입
          </button>
          <button onClick={onSubmit} className={styles.button}>
            제출하기
          </button>
        </div>
      </div>
    </div>
  );
};
