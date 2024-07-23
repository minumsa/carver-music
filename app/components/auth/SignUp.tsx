"use client";

import styles from "./SignUp.module.css";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ChangeEvent, useState } from "react";
import { userLogin, userSignUp } from "@/app/modules/api/auth";
import { getDefaultRedirectPath } from "@/app/modules/paths";

interface SignUpForm {
  userId: string;
  userName: string;
  userImage: FileList;
  email: string;
  password: string;
  passwordCheck: string;
}

export const SignUp = () => {
  const router = useRouter();
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const { register, handleSubmit, setValue, watch } = useForm<SignUpForm>({
    defaultValues: {
      userId: "",
      userName: "",
      userImage: undefined,
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
      await imgSaveHandler();
      const response = await userSignUp(userId, userName, email, password);
      if (response?.ok) {
        await userLogin(userId, password);
        getDefaultRedirectPath("user");
      }
    } catch (error) {
      console.error(error, "Failed to sign up process");
    }
  });

  // 이미지 저장
  const imgSaveHandler = async () => {
    if (!watch("userImage")) {
      return;
    }

    const formData = new FormData();
    formData.append("img", watch("userImage")[0]);
    formData.append("fileName", `user/${watch("userId")}`);

    const response = await fetch("/api/aws", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      toast.error("시스템 오류로 이미지 저장에 실패했습니다.");
    }
  };

  // 이미지 미리보기
  const fileHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;
    const isValidFile = file && file.length > 0;

    if (isValidFile) {
      const isFileSizeValid = file[0].size <= 5 * 1024 * 1024;

      if (!isFileSizeValid) {
        alert("파일 크기는 5MB를 초과할 수 없습니다.");
        return;
      }

      setValue("userImage", file);
      setPreviewImg(URL.createObjectURL(file[0]));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h3>회원가입</h3>
        <p>카버뮤직 계정을 생성합니다. 모든 필드를 필수적으로 입력해야 합니다.</p>
        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.formWrapper}>
            <div className={styles.formLeft}>
              <div className={styles.item}>
                <p className={styles.label}>아이디</p>
                <input className={styles.input} {...register("userId")} type="id" required />
              </div>
              <div className={styles.item}>
                <p className={styles.label}>닉네임</p>
                <input className={styles.input} {...register("userName")} type="name" required />
              </div>
              <div className={styles.item}>
                <p className={styles.label}>이메일</p>
                <input className={styles.input} {...register("email")} type="email" required />
              </div>
              <div className={styles.item}>
                <p className={styles.label}>비밀번호</p>
                <input
                  className={styles.input}
                  {...register("password")}
                  type="password"
                  required
                />
              </div>
              <div className={styles.item}>
                <p className={styles.label}>비밀번호 확인</p>
                <input
                  className={styles.input}
                  {...register("passwordCheck")}
                  type="password"
                  required
                />
              </div>
            </div>
            <div className={styles.formRight}>
              <p className={`${styles.item} ${styles.userProfileItem}`}>
                <p>프로필 사진</p>
                <div className={styles.userImageContainer}>
                  <div className={styles.userImageWrapper}>
                    <img
                      src={previewImg ? previewImg : "/svgs/ghost.svg"}
                      alt="user-profile"
                      className={styles.userImage}
                    />
                  </div>
                </div>
                <input
                  type="file"
                  id="fileInput"
                  className={styles.fileInput}
                  onChange={(e) => fileHandler(e)}
                  required
                />
                <label htmlFor="fileInput" className={styles.fileLabel}>
                  파일 선택
                </label>
              </p>
            </div>
          </div>
          <button onClick={onSubmit} className={styles.button}>
            제출하기
          </button>
        </form>
      </div>
    </div>
  );
};
