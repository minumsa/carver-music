import UploadUpdate from "@/app/components/upload/UploadUpdate";
import { MusicLayout } from "@/app/components/@common/MusicLayout";
import { PageProps } from "@/app/modules/types";
import Error from "@/app/components/@common/Error";
import { fetchPostData } from "@/app/modules/api/album";

export default async function Page({ params }: PageProps): Promise<React.ReactElement> {
  const currentId = params.id;

  try {
    const response = await fetchPostData(currentId);

    return (
      <MusicLayout>
        <UploadUpdate initialAlbumData={response} />
      </MusicLayout>
    );
  } catch (error) {
    return <Error error={error as Error} />;
  }
}
