import { DEFAULT_TAGS } from "@/app/modules/constants";
import styles from "./TagItem.module.css";

interface TagItemProps {
  key: string;
  onDelete: (key: string) => void;
}

export const TagItem = ({ key, onDelete }: TagItemProps) => (
  <div className={styles.tag_item} key={key} onClick={() => onDelete(key)}>
    <span>{DEFAULT_TAGS[key]}</span>
    <button className={styles.tag_delete_button} aria-label="Delete tag">
      ×
    </button>
  </div>
);
