import { Post } from "../../components/post/Post";
import { MusicLayout } from "../../components/@common/MusicLayout";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import { PageProps } from "../../modules/types";
import { fetchPostData } from "../../modules/api";

export default async function Page({ params }: PageProps) {
  const currentId = params.id;

  try {
    const postData = await fetchPostData(currentId);

    return (
      <MusicLayout>
        <Post postData={postData} />
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
    const currentUrl = `https://divdivdiv.com/music/post/${currentId}`;

    return {
      title: title,
      description: textPreview,
      openGraph: {
        title: title,
        images: [imgUrl],
        description: textPreview,
        url: currentUrl,
        type: "website",
        siteName: "divdivdiv",
      },
    };
  } catch (error) {
    throw new Error(`Failed to generate post metadata for post ID: ${currentId}`);
  }
}
