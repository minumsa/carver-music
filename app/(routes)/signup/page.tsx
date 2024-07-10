import Error from "@/app/components/@common/Error";
import { MusicLayout } from "@/app/components/@common/MusicLayout";
import { SignUp } from "@/app/components/auth/SignUp";

export default async function Page(): Promise<React.ReactElement> {
  try {
    return (
      <MusicLayout>
        <SignUp />
      </MusicLayout>
    );
  } catch (error) {
    return <Error error={error as Error} />;
  }
}
