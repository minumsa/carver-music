import "@toast-ui/editor/dist/toastui-editor.css";
import "tui-color-picker/dist/tui-color-picker.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import { Editor } from "@toast-ui/react-editor";
import { toast } from "react-toastify";

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

  const onUploadImage = async (
    blob: File,
    callback: (imageUrl: string, altText: string) => void,
  ) => {
    try {
      const imageUrl = await uploadImage(blob);
      callback(imageUrl as string, blob.name);
    } catch (error) {
      toast.error("이미지를 삽입하는 도중 오류가 발생했습니다.");
    }
  };

  const uploadImage = async (file: File) => {
    try {
      const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");

      const formData = new FormData();
      formData.append("img", file);
      formData.append("fileName", `post-image-${fileNameWithoutExtension}`);

      const response = await fetch("/api/aws", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        toast.error("이미지 저장에 실패했습니다.");
      }

      const data = await response.json();
      const imageUrl = data.imageUrl;

      return `https://carver-bucket.s3.ap-northeast-2.amazonaws.com/post-image-${fileNameWithoutExtension}`;
      // return imageUrl;
    } catch (error) {
      toast.error("이미지 저장에 실패했습니다.");
    }
  };

  // const handleClick = () => {
  //   if (editorRef.current) {
  //     const markdown = editorRef.current.getInstance().getMarkdown();
  //   }
  // };

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
          hooks={{
            // Hook to handle image upload
            addImageBlobHook: (blob: Blob, callback) => {
              onUploadImage(blob as any, (imageUrl, fileName) => {
                const altText = fileName; // Use fileName as alt text
                callback(imageUrl, altText); // Insert image with URL and alt text
              });
              return false; // Return false to prevent default behavior
            },
          }}
        />
      )}
    </>
  );
};

export default ToastEditor;
