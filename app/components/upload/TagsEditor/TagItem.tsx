import { DEFAULT_TAGS } from "@/app/modules/constants";
import styles from "./TagItem.module.css";

interface TagItemProps {
  tagKey: string;
  onDelete: (key: string) => void;
}

export const TagItem = ({ tagKey, onDelete }: TagItemProps) => {
  const tagName = DEFAULT_TAGS[tagKey];

  return (
    <div className={styles.tag_item} key={tagKey} onClick={() => onDelete(tagKey)}>
      <span>{tagName}</span>
      <button className={styles.tag_delete_button} aria-label="Delete tag">
        ×
      </button>
    </div>
  );
};
