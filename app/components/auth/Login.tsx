"use client";

import { getUserInfo, handleLogin } from "@/app/modules/api";
import styles from "./Login.module.css";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

interface LoginForm {
  email: string;
  password: string;
}

export const Login = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    const { email, password } = data;
    try {
      await handleLogin(email, password);
      router.push("/admin");
    } catch (error) {
      console.error(error, "Failed to sign up process");
    }
  });

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h3>관리자 로그인</h3>
        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.item}>
            <label className={styles.label}>이메일</label>
            <input className={styles.input} {...register("email")} type="email" required />
          </div>
          <div className={styles.item}>
            <label className={styles.label}>비밀번호</label>
            <input className={styles.input} {...register("password")} type="password" required />
          </div>
          <button onClick={onSubmit} className={styles.button}>
            제출하기
          </button>
        </form>
      </div>
    </div>
  );
};
