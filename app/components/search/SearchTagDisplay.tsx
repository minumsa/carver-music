import { SEARCH_TAGS } from "@/app/modules/constants";
import styles from "./SearchTagDisplay.module.css";
import { usePathname, useRouter } from "next/navigation";
import { isAdminPage } from "@/app/modules/utils";

interface SearchTagDisplayProps {
  currentTagName: string;
}

export const SearchTagDisplay = ({ currentTagName }: SearchTagDisplayProps) => {
  const tags = Object.keys(SEARCH_TAGS);
  const router = useRouter();
  const pathName = usePathname();

  const handleTagClick = (tag: string) => {
    const basePath = isAdminPage(pathName) ? `/admin/search/tag` : `/search/tag`;
    router.push(`${basePath}/${tag}/1`);
  };

  return (
    <div className={styles.container}>
      {tags.map((tag) => {
        const isClickedTag = currentTagName === tag;
        return (
          <div
            key={tag}
            className={`${styles.tag} ${isClickedTag ? styles.clickedTag : undefined}`}
            onClick={() => handleTagClick(tag)}
          >
            {SEARCH_TAGS[tag]}
          </div>
        );
      })}
    </div>
  );
};
