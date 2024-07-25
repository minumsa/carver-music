import { MusicLayout } from "../../../components/@common/MusicLayout";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import { PageProps } from "../../../modules/types";
import { fetchPostData } from "../../../modules/api/album";
import Error from "@/app/components/@common/Error";
import { PostContents } from "@/app/components/post/PostContents";
import { SITE_TITLE } from "@/app/modules/config";

export default async function Page({ params }: PageProps): Promise<React.ReactElement> {
  const activeId = params.id;

  try {
    const postData = await fetchPostData(activeId);

    return (
      <MusicLayout>
        <PostContents postData={postData} />
      </MusicLayout>
    );
  } catch (error) {
    return <Error error={error as Error} />;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const activeId = params.id;

  const postData = await fetchPostData(activeId);
  const { imgUrl, artist, album, text } = postData;
  const title = `${artist} - ${album}`;
  const textPreview = text.length > 30 ? text.substring(0, 30) + "..." : text;
  const activeUrl = `https://music.divdivdiv.com/post/${activeId}`;

  return {
    title: title,
    description: textPreview,
    openGraph: {
      title: title,
      images: [imgUrl],
      description: textPreview,
      url: activeUrl,
      type: "website",
      siteName: SITE_TITLE,
    },
  };
}
