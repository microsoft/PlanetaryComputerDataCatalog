import React from "react";

const DefaultBanner = ({ children }) => {
  const wrapped = React.Children.map(children, child => (
    <div className="banner-item">{child}</div>
  ));

  const banner = (
    <div className="header-banner grid-content" id="generated-docs-content">
      {wrapped}
    </div>
  );

  return banner;
};

export default DefaultBanner;
