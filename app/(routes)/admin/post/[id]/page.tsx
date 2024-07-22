import { MusicLayout } from "@/app/components/@common/MusicLayout";
import { Metadata } from "next";
import { PageProps } from "@/app/modules/types";
import { fetchPostData } from "@/app/modules/api/album";
import { SITE_TITLE } from "@/app/modules/constants";
import { PostContents } from "@/app/components/post/PostContents";

export default async function Page({ params }: PageProps) {
  const currentId = params.id;

  try {
    const postData = await fetchPostData(currentId);

    return (
      <MusicLayout>
        <PostContents postData={postData} />
      </MusicLayout>
    );
  } catch (error) {
    console.error(error);
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const currentId = params.id;

  try {
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
  } catch (error) {
    throw new Error(`Failed to generate post metadata for post ID: ${currentId}`);
  }
}
