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
    <div className={styles.container}>
      {tagKeys.map((tag) => {
        const isClickedTag = currentTagName === tag;
        return (
          <div
            key={tag}
            className={styles.tag}
            onClick={() => {
              isAdminPage(pathName)
                ? router.push(`/admin/search/tag/${tag}/1`)
                : router.push(`/search/tag/${tag}/1`);
            }}
            style={isClickedTag ? { boxShadow: "inset 0 0 0 1px var(--text-color)" } : undefined}
          >
            {SEARCH_TAGS[tag]}
          </div>
        );
      })}
    </div>
  );
};
