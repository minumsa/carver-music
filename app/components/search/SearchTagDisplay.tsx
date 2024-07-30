import { DEFAULT_TAGS } from "@/app/modules/constants/tags";
import styles from "./SearchTagDisplay.module.css";
import { usePathname, useRouter } from "next/navigation";
import { ACTIVE_TAG_STYLES, isAdminPage } from "@/app/modules/utils";

interface SearchTagDisplayProps {
  activeTag: string;
}

export const SearchTagDisplay = ({ activeTag }: SearchTagDisplayProps) => {
  const tags = Object.keys(DEFAULT_TAGS);
  const router = useRouter();
  const pathName = usePathname();

  const handleTagClick = (tag: string) => {
    const basePath = isAdminPage(pathName) ? `/admin/search/tag` : `/search/tag`;
    router.push(`${basePath}/${tag}/1`);
  };

  return (
    <div className={styles.container}>
      {tags.map((tag) => {
        const isClickedTag = activeTag === tag;
        const isActiveTag = pathName.includes(tag);
        return (
          <div
            key={tag}
            className={`${styles.tag} ${isClickedTag ? styles.clickedTag : undefined}`}
            onClick={() => handleTagClick(tag)}
            style={ACTIVE_TAG_STYLES(isActiveTag, pathName)}
          >
            {DEFAULT_TAGS[tag]}
          </div>
        );
      })}
    </div>
  );
};
