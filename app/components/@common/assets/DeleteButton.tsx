import { useRouter } from "next/navigation";
import { deleteData } from "../../../modules/api/album";
import { AlbumInfo } from "../../../modules/types";
import styles from "./Button.module.css";

interface DeleteButtonProps {
  data: AlbumInfo;
}

export const DeleteButton = ({ data }: DeleteButtonProps) => {
  const router = useRouter();
  return (
    <div
      className={styles.adminButton}
      onClick={async () => {
        const response = await deleteData(data.id);
        if (response?.status === 401) {
          router.push("/login");
        }
      }}
    >
      삭제
    </div>
  );
};
