import PropTypes from "prop-types";

import Header from "./Header";
import Footer from "./Footer";
import Announcement from "./Announcement";
import { ScrollToTopOnMount } from "./ScrollToTopOnMount";

const Layout = ({ bannerHeader, bannerFooter, isShort = false, children }) => {
  return (
    <>
      <Header />
      <Announcement />
      <div>{bannerHeader}</div>
      <ScrollToTopOnMount />
      <main className={isShort ? "short" : undefined}>{children}</main>
      {bannerFooter}
      <Footer />
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
