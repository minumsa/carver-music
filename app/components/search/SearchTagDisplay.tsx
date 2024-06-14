import { SEARCH_TAGS } from "@/app/modules/constants";
import styles from "./SearchTagDisplay.module.css";
import { usePathname, useRouter } from "next/navigation";
import { isAdminPage } from "@/app/modules/utils";

interface SearchTagDisplayProps {
  currentTagName: string;
}

export const SearchTagDisplay = ({ currentTagName }: SearchTagDisplayProps) => {
  const tagKeys = Object.keys(SEARCH_TAGS);
  const router = useRouter();
  const pathName = usePathname();

  return (
    <div className={styles.searchTagContainer}>
      {tagKeys.map((key, index) => {
        const isClickedTag = currentTagName === key;
        return (
          <div
            key={index}
            className={styles.searchTagDisplayItem}
            onClick={() => {
              isAdminPage(pathName)
                ? router.push(`/admin/search/tag/${key}/1`)
                : router.push(`/search/tag/${key}/1`);
            }}
            style={isClickedTag ? { boxShadow: "inset 0 0 0 1px var(--text-color)" } : undefined}
          >
            {SEARCH_TAGS[key]}
          </div>
        );
      })}
    </div>
  );
};
