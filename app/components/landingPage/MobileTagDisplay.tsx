import { useAtom, useSetAtom } from "jotai";
import { LANDING_PAGE_TAGS } from "../../modules/constants/tags";
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
import { ACTIVE_TAG_STYLES, isLandingPage } from "@/app/modules/utils";

const MobileTagDisplay = () => {
  const setAlbumData = useSetAtom(albumDataAtom);
  const setScrollCount = useSetAtom(scrollCountAtom);
  const setTotalScrollCount = useSetAtom(totalScrollCountAtom);
  const setScrollPosition = useSetAtom(scrollPositionAtom);
  const [showAllTagItems, setShowAllTagItems] = useAtom(showAllTagItemsAtom);
  const [activeTag, setCurrentTag] = useAtom(tagAtom);
  const pathName = usePathname();

  const handleTagSelection = (tag: string) => {
    setCurrentTag(tag);
    setAlbumData([]);
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
            const isActiveTag = activeTag === tag || (activeTag === "" && tag === "all");
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
