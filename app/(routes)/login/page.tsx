import Error from "@/app/components/@common/Error";
import { MusicLayout } from "@/app/components/@common/MusicLayout";
import { Login } from "@/app/components/auth/Login";

export default async function Page(): Promise<React.ReactElement> {
  try {
    return (
      <MusicLayout>
        <Login />
      </MusicLayout>
    );
  } catch (error) {
    return <Error error={error as Error} />;
  }
}
