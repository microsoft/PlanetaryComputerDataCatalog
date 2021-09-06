import PropTypes from "prop-types";

import Header from "./Header";
import Footer from "./Footer";
import Announcement from "./Announcement";
import { ScrollToTopOnMount } from "./ScrollToTopOnMount";

const Layout = ({
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

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
