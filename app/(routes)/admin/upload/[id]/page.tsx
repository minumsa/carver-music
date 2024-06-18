"use client";

import UploadUpdate from "@/app/components/upload/UploadUpdate";
import { MusicLayout } from "@/app/components/@common/MusicLayout";
import { PageProps } from "@/app/modules/types";

export default function Page({ params }: PageProps) {
  const currentId = params.id;

  return (
    <MusicLayout>
      <UploadUpdate currentId={currentId} />
    </MusicLayout>
  );
}
