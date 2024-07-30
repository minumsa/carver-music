import { PageNumbers } from "./assets/PageNumbers";

interface ContentLayoutProps {
  children: React.ReactNode;
  activePage: number;
  dataCount: number;
}

export const ContentLayout = ({ children, activePage, dataCount }: ContentLayoutProps) => {
  const hasData = dataCount > 0;
  return (
    <>
      {children}
      {hasData && <PageNumbers activePage={activePage} dataCount={dataCount} />}
    </>
  );
};
