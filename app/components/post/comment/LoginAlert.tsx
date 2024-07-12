import { useRouter } from "next/navigation";
import styles from "./LoginAlert.module.css";

interface LoginAlertProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LoginAlert = ({ setShowModal }: LoginAlertProps) => {
  const router = useRouter();

  return (
    <div className={styles.dimWrapper}>
      <div className={styles.container}>
        <div>로그인 후 댓글 작성이 가능합니다.</div>
        <div className={styles.buttonContainer}>
          <div
            className={styles.button}
            style={{ marginRight: "-1px" }}
            onClick={() => {
              setShowModal(false);
            }}
          >
            취소
          </div>
          <div
            className={styles.button}
            onClick={() => {
              router.push("/login");
            }}
          >
            로그인
          </div>
        </div>
      </div>
    </div>
  );
};
