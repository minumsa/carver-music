import "@toast-ui/editor/dist/toastui-editor.css";
import "tui-color-picker/dist/tui-color-picker.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import { Editor } from "@toast-ui/react-editor";

interface ToastEditorProps {
  content: string;
  editorRef: React.MutableRefObject<any>;
}

const ToastEditor = ({ content = "", editorRef }: ToastEditorProps) => {
  const toolbarItems = [
    ["heading", "bold", "italic", "strike"],
    ["hr", "quote"],
    ["ul", "ol", "task"],
    ["table", "link"],
    ["image"],
    ["code"],
    ["scrollSync"],
  ];

  return (
    <>
      {editorRef && (
        <Editor
          ref={editorRef}
          initialValue={content || " "} // 글 수정 시 사용
          initialEditType="wysiwyg" // wysiwyg & markdown
          previewStyle={"vertical"} // tab, vertical
          hideModeSwitch={true}
          height="calc(100% - 41px)"
          usageStatistics={false}
          toolbarItems={toolbarItems}
          useCommandShortcut={true}
          plugins={[colorSyntax]}
          theme={"dark"} // '' & 'dark'
        />
      )}
    </>
  );
};

export default ToastEditor;
