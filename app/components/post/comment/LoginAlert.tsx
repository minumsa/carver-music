import { useRouter } from "next/navigation";
import styles from "./LoginAlert.module.css";

interface LoginAlertProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LoginAlert = ({ showModal, setShowModal }: LoginAlertProps) => {
  const router = useRouter();

  return (
    showModal && (
      <div className={styles.dimWrapper}>
        <div className={styles.container}>
          <div className={styles.text}>로그인 후 댓글 기능을 사용할 수 있습니다.</div>
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
    )
  );
};
