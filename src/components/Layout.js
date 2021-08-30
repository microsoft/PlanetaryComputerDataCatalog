import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import * as qs from "query-string";

import Header from "./Header";
import Footer from "./Footer";
import Announcement from "./Announcement";
import { ScrollToTopOnMount } from "./ScrollToTopOnMount";

const Layout = ({
  bannerHeader = null,
  bannerFooter = null,
  isShort = false,
  children,
}) => {
  const params = qs.parse(useLocation().search);

  const embedded = params.embed.toLowerCase() === "true" || false;

  return (
    <>
      {!embedded && <Header />}
      {!embedded && <Announcement />}
      {bannerHeader && <div>{bannerHeader}</div>}
      <ScrollToTopOnMount />
      <main className={isShort ? "short" : undefined}>{children}</main>
      {bannerFooter}
      {!embedded && <Footer />}
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
