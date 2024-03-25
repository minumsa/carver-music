"use client";

import { MusicLayout } from "../../components/@common/MusicLayout";
import UploadUpdate from "../../components/upload/UploadUpdate";

export default function Page() {
  return (
    <MusicLayout>
      <UploadUpdate currentId={""} />
    </MusicLayout>
  );
}
