import { AlbumData } from "../../../modules/types";
import styles from "./Button.module.css";
import Link from "next/link";

interface EditButtonProps {
  data: AlbumData;
}

export const EditButton = ({ data }: EditButtonProps) => {
  return (
    <Link
      href={`/admin/upload/${data.id}`}
      className={styles.adminButton}
      style={{ marginRight: "-1px" }}
    >
      수정
    </Link>
  );
};
