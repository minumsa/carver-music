import { useAtom, useSetAtom } from "jotai";
import { LANDING_PAGE_TAGS } from "../../modules/constants";
import styles from "./MobileTagDisplay.module.css";
import {
  albumDataAtom,
  scrollCountAtom,
  scrollPositionAtom,
  totalScrollCountAtom,
  showAllTagItemsAtom,
} from "../../modules/atoms";
import { memo } from "react";

interface MobileTagDisplayProps {
  currentTag: string;
  setCurrentTag: (value: string) => void;
}

const MobileTagDisplay = ({ currentTag, setCurrentTag }: MobileTagDisplayProps) => {
  const setData = useSetAtom(albumDataAtom);
  const setScrollCount = useSetAtom(scrollCountAtom);
  const setTotalScrollCount = useSetAtom(totalScrollCountAtom);
  const setScrollPosition = useSetAtom(scrollPositionAtom);
  const [showAllTagItems, setShowAllTagItems] = useAtom(showAllTagItemsAtom);

  const handleTagSelection = (tag: string) => {
    setCurrentTag(tag);
    resetDataAndScroll();
  };

  const resetDataAndScroll = () => {
    setData([]);
    setScrollCount(1);
    setTotalScrollCount(0);
    setScrollPosition(0);
    setShowAllTagItems(false);
  };

  const tagStyles = (isActive: boolean) =>
    isActive ? { boxShadow: "inset 0 0 0 1px var(--text-color)", order: -1 } : undefined;

  return (
    <div className={styles.container} style={{ flexWrap: showAllTagItems ? "wrap" : "nowrap" }}>
      {Object.keys(LANDING_PAGE_TAGS).map((tag) => {
        const isActive = currentTag === tag || (currentTag === "" && tag === "all");
        const tagName = LANDING_PAGE_TAGS[tag];
        return (
          <div
            key={tag}
            className={styles.tagItem}
            onClick={() => handleTagSelection(tag)}
            style={tagStyles(isActive)}
          >
            {tagName}
          </div>
        );
      })}
      <div className={styles.arrowWrapper} onClick={() => setShowAllTagItems(!showAllTagItems)}>
        <img
          className={styles.arrow}
          src={showAllTagItems ? "/svgs/arrow-up.svg" : "/svgs/arrow-down.svg"}
          alt="arrow"
        />
      </div>
    </div>
  );
};

export default memo(MobileTagDisplay);
