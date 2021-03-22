import React from "react";

const AssetThumbnail = ({ assets, placeholder = "400x181" }) => {
  // TODO: remove placeholder service when all collections have a src href
  const imgSrc =
    assets?.thumbnail?.href || `https://via.placeholder.com/${placeholder}`;

  return <img src={imgSrc} alt="Dataset thumbnail" />;
};

export default AssetThumbnail;
