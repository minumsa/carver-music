"use client";

import styles from "./Error.module.css";
import { useEffect } from "react";

interface ErrorProps {
  error: Error;
}

export default function Error({ error }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const reset = () => {
    window.location.reload();
  };

  return (
    <div className={styles.container}>
      <img src="/svgs/ghost.svg" alt="error-ghost" />
      <div className={styles.title}>Sorry!</div>
      <div>기술적인 문제가 발생해 일시적으로 사이트에 접속할 수 없습니다.</div>
      <div>잠시 후 다시 시도해주세요.</div>
      <button className={styles.button} onClick={() => reset()}>
        다시 시도
      </button>
    </div>
  );
}
