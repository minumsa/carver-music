import { useAtom, useSetAtom } from "jotai";
import { DEFAULT_TAGS } from "../../modules/constants";
import styles from "./MobileTagDisplay.module.css";
import {
  tagAtom,
  albumDataAtom,
  scrollCountAtom,
  scrollPositionAtom,
  totalScrollCountAtom,
  showAllTagItemsAtom,
} from "../../modules/atoms";

export const MobileTagDisplay = () => {
  const setData = useSetAtom(albumDataAtom);
  const setScrollCount = useSetAtom(scrollCountAtom);
  const setTotalScrollCount = useSetAtom(totalScrollCountAtom);
  const [currentTag, setCurrentTag] = useAtom(tagAtom);
  const [scrollPosition, setScrollPosition] = useAtom(scrollPositionAtom);
  const [showAllTagItems, setShowAllTagItems] = useAtom(showAllTagItemsAtom);

  function handleClickTag(tag: string) {
    setCurrentTag(tag);
    setData([]);
    setScrollCount(1);
    setTotalScrollCount(0);
    setScrollPosition(0);
    window.scrollTo(0, scrollPosition);
    setShowAllTagItems(false);
  }

  return (
    <div
      className={styles.container}
      style={showAllTagItems ? { flexWrap: "wrap" } : { flexWrap: "nowrap" }}
    >
      {Object.keys(DEFAULT_TAGS).map((tag) => {
        const isClickedTag = currentTag === tag;
        const isDefaultTagSelected = currentTag === "" && tag === "all";
        const tagName = DEFAULT_TAGS[tag];
        return (
          <div
            key={tag}
            className={styles.tagItem}
            onClick={() => {
              handleClickTag(tag);
            }}
            style={
              isClickedTag || isDefaultTagSelected
                ? { boxShadow: "inset 0 0 0 1px var(--text-color)", order: -1 }
                : undefined
            }
          >
            {tagName}
          </div>
        );
      })}
      <div
        className={styles.arrowWrapper}
        onClick={() => {
          setShowAllTagItems(!showAllTagItems);
        }}
      >
        <img
          className={styles.arrow}
          src={showAllTagItems ? "/svgs/arrow-up.svg" : "/svgs/arrow-down.svg"}
          alt="arrow"
        />
      </div>
    </div>
  );
};
