"use client";

import { attemptLogin } from "@/app/modules/api";
import styles from "./Login.module.css";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

interface LoginForm {
  userId: string;
  password: string;
}

export const Login = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<LoginForm>({
    defaultValues: {
      userId: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    const { userId, password } = data;
    try {
      const response = await attemptLogin(userId, password);
      if (response?.ok) router.push("/");
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
            <input className={styles.input} {...register("userId")} type="email" required />
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
