import { PageNumbers } from "./assets/PageNumbers";

interface ContentLayoutProps {
  children: React.ReactNode;
  currentPage: number;
  dataCount: number;
}

export const ContentLayout = ({ children, currentPage, dataCount }: ContentLayoutProps) => {
  const hasData = dataCount > 0;
  return (
    <>
      {children}
      {hasData && <PageNumbers currentPage={currentPage} dataCount={dataCount} />}
    </>
  );
};
