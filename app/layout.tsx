import React from "react";
import "./globals.css";

const SITE_TITLE = "카버뮤직";

export const metadata = {
  title: SITE_TITLE,
  description: "",
  openGraph: {
    locale: "ko_KR",
    siteName: SITE_TITLE,
    title: SITE_TITLE,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@dev_carver",
    description: SITE_TITLE,
    title: SITE_TITLE,
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
