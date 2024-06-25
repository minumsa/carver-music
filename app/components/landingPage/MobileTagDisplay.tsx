import { useAtom, useSetAtom } from "jotai";
import { ACTIVE_TAG_STYLES, LANDING_PAGE_TAGS } from "../../modules/constants";
import styles from "./MobileTagDisplay.module.css";
import {
  albumDataAtom,
  scrollCountAtom,
  scrollPositionAtom,
  totalScrollCountAtom,
  showAllTagItemsAtom,
  tagAtom,
} from "../../modules/atoms";
import { memo } from "react";
import { usePathname } from "next/navigation";
import { isLandingPage } from "@/app/modules/utils";

const MobileTagDisplay = () => {
  const setData = useSetAtom(albumDataAtom);
  const setScrollCount = useSetAtom(scrollCountAtom);
  const setTotalScrollCount = useSetAtom(totalScrollCountAtom);
  const setScrollPosition = useSetAtom(scrollPositionAtom);
  const [showAllTagItems, setShowAllTagItems] = useAtom(showAllTagItemsAtom);
  const [currentTag, setCurrentTag] = useAtom(tagAtom);
  const pathName = usePathname();

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

  return (
    <>
      {isLandingPage(pathName) && (
        <div className={styles.container} style={{ flexWrap: showAllTagItems ? "wrap" : "nowrap" }}>
          {Object.keys(LANDING_PAGE_TAGS).map((tag) => {
            const isActiveTag = currentTag === tag || (currentTag === "" && tag === "all");
            const tagName = LANDING_PAGE_TAGS[tag];
            return (
              <div
                key={tag}
                className={styles.tagItem}
                onClick={() => handleTagSelection(tag)}
                style={ACTIVE_TAG_STYLES(isActiveTag, pathName)}
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
      )}
    </>
  );
};

export default memo(MobileTagDisplay);
