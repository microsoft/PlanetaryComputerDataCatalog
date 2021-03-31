import React from "react";

const DefaultBanner = ({ children }) => {
  const wrapped = React.Children.map(children, child => (
    <div className="ds-item">{child}</div>
  ));

  const banner = (
    <div
      className="column-list"
      style={{
        background: "#F0F0F0",
        minHeight: "200px",
        padding: "0 10%",
      }}
    >
      {wrapped}
    </div>
  );

  return banner;
};

export default DefaultBanner;
