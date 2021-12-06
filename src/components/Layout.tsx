import { ReactNode, CSSProperties } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Announcement from "./Announcement";
import { ScrollToTopOnMount } from "./ScrollToTopOnMount";

interface Props {
  bannerHeader?: ReactNode;
  bannerFooter?: ReactNode;
  isShort?: boolean;
  onGrid?: boolean;
  allowAnnouncement?: boolean;
  mainStyle?: CSSProperties;
}

const Layout: React.FC<Props> = ({
  bannerHeader = null,
  bannerFooter = null,
  isShort = false,
  onGrid = true,
  children,
  allowAnnouncement = true,
  mainStyle,
}) => {
  return (
    <>
      <Header onGrid={onGrid} />
      {allowAnnouncement && <Announcement />}
      {bannerHeader && <div>{bannerHeader}</div>}
      <ScrollToTopOnMount />
      <main className={isShort ? "short" : undefined} style={mainStyle}>
        {children}
      </main>
      {bannerFooter}
      <Footer onGrid={onGrid} />
    </>
  );
};

export default Layout;
