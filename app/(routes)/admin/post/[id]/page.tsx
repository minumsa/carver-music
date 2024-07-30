import { MusicLayout } from "@/app/components/@common/MusicLayout";
import { Metadata } from "next";
import { PageProps } from "@/app/modules/types";
import { fetchPostData } from "@/app/modules/api/album";
import { PostContents } from "@/app/components/post/PostContents";
import { SITE_TITLE } from "@/app/modules/config";

export default async function Page({ params }: PageProps) {
  const activeId = params.id;

  try {
    const postData = await fetchPostData(activeId);

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
  const activeId = params.id;

  try {
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
  } catch (error) {
    throw new Error(`Failed to generate post metadata for post ID: ${activeId}`);
  }
}
