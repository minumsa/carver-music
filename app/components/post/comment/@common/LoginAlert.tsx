import { useRouter } from "next/navigation";
import styles from "./LoginAlert.module.css";

interface LoginAlertProps {
  showLoginModal: boolean;
  setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LoginAlert = ({ showLoginModal, setShowLoginModal }: LoginAlertProps) => {
  const router = useRouter();

  return (
    showLoginModal && (
      <div className={styles.dimWrapper}>
        <div className={styles.container}>
          <div className={styles.text}>로그인 후 댓글 기능을 사용할 수 있습니다.</div>
          <div className={styles.buttonContainer}>
            <button
              className={styles.button}
              style={{ marginRight: "-1px" }}
              onClick={() => {
                setShowLoginModal(false);
              }}
            >
              취소
            </button>
            <button
              className={styles.button}
              onClick={() => {
                router.push("/login");
              }}
            >
              로그인
            </button>
          </div>
        </div>
      </div>
    )
  );
};
