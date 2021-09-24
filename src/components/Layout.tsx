import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Announcement from "./Announcement";
import { ScrollToTopOnMount } from "./ScrollToTopOnMount";

interface Props {
  bannerHeader?: ReactNode;
  bannerFooter?: ReactNode;
  isShort?: boolean;
  onGrid?: boolean;
}

const Layout: React.FC<Props> = ({
  bannerHeader = null,
  bannerFooter = null,
  isShort = false,
  onGrid = true,
  children,
}) => {
  return (
    <>
      <Header onGrid={onGrid} />
      <Announcement />
      {bannerHeader && <div>{bannerHeader}</div>}
      <ScrollToTopOnMount />
      <main className={isShort ? "short" : undefined}>{children}</main>
      {bannerFooter}
      <Footer onGrid={onGrid} />
    </>
  );
};

export default Layout;
