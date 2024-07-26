"use client";

import styles from "./Login.module.css";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { userLogin } from "@/app/modules/api/auth";

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

  const onSubmit = handleSubmit(async (data) => {
    const { id, password } = data;
    try {
      const { role } = await userLogin(id, password);
      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error(error, "Failed to sign up process");
    }
  });

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
