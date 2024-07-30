import styles from "./TagsEditor.module.css";
import React, { useRef, useState } from "react";
import useClickOutside from "@/app/hooks/useClickOutside";
import { TagItem } from "./TagItem";
import { TagModal } from "./TagModal";

interface TagsEditorProps {
  activeTagKeys: string[];
  setCurrentTagKeys: React.Dispatch<React.SetStateAction<string[]>>;
}

export const TagsEditor = ({ activeTagKeys, setCurrentTagKeys }: TagsEditorProps) => {
  const [newTagKey, setNewTagKey] = useState("");
  const [showTagsModal, setShowTagsModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const deleteTagItem = (selectedKey: string) => {
    setCurrentTagKeys((prevTagKeys: string[]) =>
      prevTagKeys.filter((prevTagKey: string) => prevTagKey !== selectedKey),
    );
  };

  const addTagItem = (selectedKey: string) => {
    setCurrentTagKeys((prevTagKeys) => [...prevTagKeys, selectedKey]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isExisingTag = activeTagKeys.includes(newTagKey);

    if (e.key === "Enter") {
      if (!isExisingTag) setCurrentTagKeys((prevTagKeys) => [...prevTagKeys, newTagKey]);
    }
  };

  const handleOutsideClick = () => {
    setShowTagsModal(false);
    setNewTagKey("");
  };

  useClickOutside(modalRef, handleOutsideClick);

  return (
    <div ref={modalRef} className={styles.blockContainer}>
      <label className={styles.blockTitle}>태그</label>
      <div className={styles.tagListContainer}>
        {activeTagKeys.map((tag: string) => {
          return <TagItem key={tag} tagKey={tag} onDelete={deleteTagItem} />;
        })}
        {showTagsModal && (
          <TagModal
            activeTagKeys={activeTagKeys}
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
