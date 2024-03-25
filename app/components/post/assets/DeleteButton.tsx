import { deleteData } from "../../../modules/api";
import { AlbumInfo } from "../../../modules/types";
import styles from "./Button.module.css";

interface DeleteButtonProps {
  data: AlbumInfo;
}

export const DeleteButton = ({ data }: DeleteButtonProps) => {
  return (
    <div
      className={styles["admin-button"]}
      onClick={() => {
        deleteData(data.id);
      }}
    >
      삭제
    </div>
  );
};
