import styles from "./TagsEditor.module.css";
import React, { useRef, useState } from "react";
import useOutsideClick from "@/app/hooks/useOutsideClick";
import { TagItem } from "./TagItem";
import { TagModal } from "./TagModal";

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
    <div ref={modalRef} className={styles.blockContainer}>
      <div className={styles.blockTitle}>태그</div>
      <div className={styles.tagListContainer}>
        {currentTagKeys.map((tagKey: string) => {
          return <TagItem key={tagKey} tagKey={tagKey} onDelete={deleteTagItem} />;
        })}
        {showTagsModal && (
          <TagModal
            currentTagKeys={currentTagKeys}
            addTagItem={addTagItem}
            onClose={() => setShowTagsModal(false)}
          />
        )}
        <input
          value={newTagKey}
          className={styles.tagItemInput}
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
