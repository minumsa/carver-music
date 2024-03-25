import React from "react";
import "./globals.css";

export const metadata = {
  title: "카버차트",
  description: "",
  openGraph: {
    locale: "ko_KR",
    siteName: "카버차트",
    title: "카버차트",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@dev_carver",
    description: "카버차트",
    title: "카버차트",
  },
};

type Layout = {
  children: React.ReactNode;
};

const Layout = ({ children }: Layout) => {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
};

export default Layout;
