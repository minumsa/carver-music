import React from "react";
import { GROUP_TAGS } from "@/app/modules/constants";
import styles from "./TagModal.module.css";

interface TagModalProps {
  currentTagKeys: string[];
  addTagItem: (tag: string) => void;
  onClose: () => void;
}

export const TagModal = ({ currentTagKeys, addTagItem, onClose }: TagModalProps) => {
  return (
    <div className={styles.container} onClick={onClose}>
      <div className={styles.tagModal} onClick={(e) => e.stopPropagation()}>
        {Object.keys(GROUP_TAGS).map((tagTheme, index) => {
          const isNormalTag = tagTheme !== "모두보기";
          return (
            isNormalTag && (
              <React.Fragment key={index}>
                <div className={styles.tagTheme}>{tagTheme}</div>
                <div className={styles.tagWrapper}>
                  {Object.keys(GROUP_TAGS[tagTheme]).map((tag) => {
                    const isExistingTag = currentTagKeys.includes(tag);
                    const tagName = GROUP_TAGS[tagTheme][tag];
                    return (
                      !isExistingTag && (
                        <div
                          className={styles.tag}
                          key={tag}
                          onClick={() => {
                            addTagItem(tag);
                          }}
                        >
                          {tagName}
                          <button className={styles.addButton} aria-label="Add tag">
                            +
                          </button>
                        </div>
                      )
                    );
                  })}
                </div>
              </React.Fragment>
            )
          );
        })}
      </div>
    </div>
  );
};
