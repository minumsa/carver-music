"use client";

import { userSignUp } from "@/app/modules/api";
import styles from "./SignUp.module.css";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface SignUpForm {
  userId: string;
  userName: string;
  email: string;
  password: string;
  passwordCheck: string;
}

export const SignUp = () => {
  const router = useRouter();
  const { register, handleSubmit, watch } = useForm<SignUpForm>({
    defaultValues: {
      userId: "",
      userName: "",
      email: "",
      password: "",
      passwordCheck: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    const { userId, userName, email, password, passwordCheck } = data;

    if (password !== passwordCheck) {
      toast.warning("입력한 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await userSignUp(userId, userName, email, password);
      if (response?.ok) router.push("/");
    } catch (error) {
      console.error(error, "Failed to sign up process");
    }
  });

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h3>회원가입</h3>
        <div>카버뮤직 계정을 생성합니다. 모든 필드를 필수적으로 입력해야 합니다.</div>
        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.item}>
            <div className={styles.label}>아이디</div>
            <input className={styles.input} {...register("userId")} type="id" required />
          </div>
          <div className={styles.item}>
            <div className={styles.label}>닉네임</div>
            <input className={styles.input} {...register("userName")} type="name" required />
          </div>
          <div className={styles.item}>
            <div className={styles.label}>이메일</div>
            <input className={styles.input} {...register("email")} type="email" required />
          </div>
          <div className={styles.item}>
            <div className={styles.label}>비밀번호</div>
            <input className={styles.input} {...register("password")} type="password" required />
          </div>
          <div className={styles.item}>
            <div className={styles.label}>비밀번호 확인</div>
            <input
              className={styles.input}
              {...register("passwordCheck")}
              type="password"
              required
            />
          </div>
          <button onClick={onSubmit} className={styles.button}>
            제출하기
          </button>
        </form>
      </div>
    </div>
  );
};
