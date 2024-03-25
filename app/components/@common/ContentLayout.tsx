import { PageNumbers } from "../post/assets/PageNumbers";

interface ContentLayoutProps {
  children: React.ReactNode;
  currentPage: number;
  dataCount: number;
}

export const ContentLayout = ({ children, currentPage, dataCount }: ContentLayoutProps) => {
  return (
    <>
      {children}
      {dataCount > 0 && <PageNumbers currentPage={currentPage} dataCount={dataCount} />}
    </>
  );
};
