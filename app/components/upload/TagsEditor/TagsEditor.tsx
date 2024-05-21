import { DEFAULT_TAGS, GROUP_TAGS } from "@/app/modules/constants";
import styles from "./TagsEditor.module.css";
import React, { useRef, useState } from "react";
import useOutsideClick from "@/app/hooks/useOutsideClick";
import { TagItem } from "./TagItem";

interface TagsEditorProps {
  currentTagKeys: string[];
  setCurrentTagKeys: React.Dispatch<React.SetStateAction<string[]>>;
}

export const TagsEditor = ({ currentTagKeys, setCurrentTagKeys }: TagsEditorProps) => {
  const [newTagKey, setNewTagKey] = useState("");
  const [showTagsModal, setShowTagsModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const deleteTagItem = (selectedKey: string) => {
    setCurrentTagKeys((prevTagKeys) =>
      prevTagKeys.filter((prevTagKey) => prevTagKey !== selectedKey),
    );
  };

  const addTagItem = (selectedKey: string) => {
    setCurrentTagKeys((prevTagKeys) => [...prevTagKeys, selectedKey]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isExisingTag = currentTagKeys.includes(newTagKey);

    if (e.key === "Enter") {
      if (!isExisingTag) setCurrentTagKeys((prevTagKeys) => [...prevTagKeys, newTagKey]);
    }
  };

  const handleOutsideClick = () => {
    setShowTagsModal(false);
    setNewTagKey("");
  };

  useOutsideClick(modalRef, handleOutsideClick);

  return (
    <div ref={modalRef} className={styles.block_container}>
      <div className={styles.block_title}>태그</div>
      <div className={styles.tag_list_container}>
        {currentTagKeys.map((key: string) => {
          return <TagItem key={key} onDelete={deleteTagItem} />;
        })}
        {showTagsModal && (
          <div className={styles.tag_modal_container}>
            <div className={styles.tag_modal}>
              <div className={styles.tag_item_container}>
                {Object.keys(GROUP_TAGS).map((tagTheme, index) => {
                  const isNormalTag = tagTheme !== "모두보기";
                  return (
                    isNormalTag && (
                      <React.Fragment key={index}>
                        <div className={styles.tag_block_title}>{tagTheme}</div>
                        <div className={styles.tag_block_item_container} key={index}>
                          {Object.keys(GROUP_TAGS[tagTheme]).map((tag) => {
                            const isExistingTag = currentTagKeys.includes(tag);
                            return (
                              !isExistingTag && (
                                <div
                                  className={styles.tag_item}
                                  key={tag}
                                  onClick={() => {
                                    addTagItem(tag);
                                  }}
                                >
                                  {GROUP_TAGS[tagTheme][tag]}
                                  <button className={styles.tag_delete_button} aria-label="Add tag">
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
          </div>
        )}
        <input
          value={newTagKey}
          className={styles.tag_item_input}
          placeholder="태그 생성"
          onClick={() => {
            setShowTagsModal(true);
          }}
          onChange={(e) => {
            const tmp = e.target.value;
            if (tmp.startsWith("#")) {
              setNewTagKey(tmp);
            } else {
              setNewTagKey("#" + tmp);
            }
          }}
          onKeyDown={handleKeyPress}
        />
      </div>
    </div>
  );
};
