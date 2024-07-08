"use client";

import { handleSignUp } from "@/app/modules/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./SignUp.module.css";
import { useForm } from "react-hook-form";

interface SignUpForm {
  email: string;
  password: string;
}

export const SignUp = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<SignUpForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    const { email, password } = data;
    try {
      await handleSignUp(email, password);
    } catch (error) {
      console.error(error, "Failed to sign up process");
    }
  });

  return (
    <div className={styles.container}>
      <h1>회원가입</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label>이메일</label>
          <input {...register("email")} type="email" required />
        </div>
        <div>
          <label>비밀번호</label>
          <input {...register("password")} type="password" required />
        </div>
        <button onClick={onSubmit}>회원가입</button>
      </form>
    </div>
  );
};
