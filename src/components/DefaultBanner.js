import React from "react";

const DefaultBanner = ({ children }) => {
  const wrapped = React.Children.map(children, child => (
    <div className="ds-item">{child}</div>
  ));

  const banner = (
    <div
      className="ds-list"
      style={{
        background: "#F0F0F0",
        minHeight: "200px",
      }}
    >
      {wrapped}
    </div>
  );

  return banner;
};

export default DefaultBanner;
