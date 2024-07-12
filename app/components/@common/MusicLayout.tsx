"use client";

import { usePathname } from "next/navigation";
import { Category } from "./header/Category";
import styles from "./MusicLayout.module.css";
import { isUploadPage } from "../../modules/utils";
import { ToastContainer } from "react-toastify";
import MobileTagDisplay from "../landingPage/MobileTagDisplay";
import "react-toastify/dist/ReactToastify.css";
import { Snow } from "./Snow";
import { Footer } from "./footer/Footer";
import { useEffect, useMemo } from "react";
import { getUserInfo } from "@/app/modules/api";
import { useSetAtom } from "jotai";
import { userIdAtom, userImageAtom, userNameAtom } from "@/app/modules/atoms";

export const MusicLayout = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname();
  const setUserName = useSetAtom(userNameAtom);
  const setUserId = useSetAtom(userIdAtom);
  const setUserImage = useSetAtom(userImageAtom);

  const loginCheck = useMemo(
    () => async () => {
      try {
        const response = await getUserInfo();
        if (response.login) {
          setUserId(response.userId);
          setUserName(response.userName);
          setUserImage(response.userImage);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [],
  );

  useEffect(() => {
    loginCheck();
  }, [loginCheck]);

  return (
    <div className={styles.layoutContainer}>
      <ToastContainer
        position="top-right" // 알람 위치 지정
        autoClose={3000} // 자동 off 시간
        hideProgressBar={false} // 진행시간바 숨김
        closeOnClick // 클릭으로 알람 닫기
        rtl={false} // 알림 좌우 반전
        pauseOnFocusLoss // 화면을 벗어나면 알람 정지
        draggable // 드래그 가능
        pauseOnHover // 마우스를 올리면 알람 정지
        theme="dark" // 알람 테마
        limit={1} // 알람 개수 제한
        style={{ zIndex: 100000 }}
      />
      {/* <Snow /> */}
      <div className={styles.container}>
        <header className={styles.categoryContainer}>
          <Category />
          <MobileTagDisplay />
        </header>
        <main
          className={styles.contentContainer}
          style={{ alignItems: isUploadPage(pathName) ? "center" : undefined }}
        >
          {children}
        </main>
        {/* <Footer /> */}
      </div>
    </div>
  );
};
