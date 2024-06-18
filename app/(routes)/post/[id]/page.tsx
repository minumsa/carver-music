import { MusicLayout } from "../../../components/@common/MusicLayout";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import { PageProps } from "../../../modules/types";
import { fetchPostData } from "../../../modules/api";
import { SITE_TITLE } from "@/app/modules/constants";
import Error from "@/app/components/@common/Error";
import { PostContents } from "@/app/components/post/PostContents";

export default async function Page({ params }: PageProps): Promise<React.ReactElement> {
  const currentId = params.id;

  try {
    const postData = await fetchPostData(currentId);

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
  const currentId = params.id;

  const postData = await fetchPostData(currentId);
  const { imgUrl, artist, album, text } = postData;
  const title = `${artist} - ${album}`;
  const textPreview = text.length > 30 ? text.substring(0, 30) + "..." : text;
  const currentUrl = `https://music.divdivdiv.com/post/${currentId}`;

  return {
    title: title,
    description: textPreview,
    openGraph: {
      title: title,
      images: [imgUrl],
      description: textPreview,
      url: currentUrl,
      type: "website",
      siteName: SITE_TITLE,
    },
  };
}
