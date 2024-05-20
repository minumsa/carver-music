import { useAtom, useSetAtom } from "jotai";
import { DEFAULT_TAGS } from "../../modules/constants";
import styles from "./MobileTagDisplay.module.css";
import {
  tagKeyAtom,
  albumDataAtom,
  scrollCountAtom,
  scrollPositionAtom,
  totalScrollCountAtom,
  showAllTagItemsAtom,
} from "../../modules/atoms";

export const MobileTagDisplay = () => {
  const setData = useSetAtom(albumDataAtom);
  const setScrollCount = useSetAtom(scrollCountAtom);
  const setNewTotalScrollCount = useSetAtom(totalScrollCountAtom);
  const [currentTagKey, setCurrentTagKey] = useAtom(tagKeyAtom);
  const [scrollPosition, setScrollPosition] = useAtom(scrollPositionAtom);
  const [showAllTagItems, setShowAllTagItems] = useAtom(showAllTagItemsAtom);

  function resetDataAndScroll(key: string) {
    setCurrentTagKey(key);
    setData([]);
    setScrollCount(1);
    setNewTotalScrollCount(0);
    window.scrollTo(0, scrollPosition);
    setScrollPosition(0);
  }

  return (
    <div className={styles.container}>
      {Object.keys(DEFAULT_TAGS).map((key, index) => {
        return (
          <div
            key={index}
            className={styles["tag-display-item"]}
            onClick={() => {
              resetDataAndScroll(key);
            }}
            style={
              currentTagKey === key || (currentTagKey === "" && key === "all")
                ? { boxShadow: "inset 0 0 0 1px var(--text-color)", order: -1 }
                : undefined
            }
          >
            {DEFAULT_TAGS[key]}
          </div>
        );
      })}
      <div
        className={styles["arrow-container"]}
        onClick={() => {
          setShowAllTagItems(!showAllTagItems);
        }}
      >
        <img
          className={styles["arrow"]}
          src={showAllTagItems ? "/icons/arrow-up.svg" : "/icons/arrow-down.svg"}
          alt="arrow"
        />
      </div>
    </div>
  );
};
