import dynamic from "next/dynamic";

export const ToastEditorNoSSR = dynamic(() => import("./ToastEditor"), {
  ssr: false,
});
