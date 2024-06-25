import { ACTIVE_TAG_STYLES, DEFAULT_TAGS } from "@/app/modules/constants";
import styles from "./SearchTagDisplay.module.css";
import { usePathname, useRouter } from "next/navigation";
import { isAdminPage } from "@/app/modules/utils";

interface SearchTagDisplayProps {
  currentTag: string;
}

export const SearchTagDisplay = ({ currentTag }: SearchTagDisplayProps) => {
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
        const isClickedTag = currentTag === tag;
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
