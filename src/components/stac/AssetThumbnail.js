import React from "react";

const AssetThumbnail = ({ assets, placeholder = "400x181", style = {} }) => {
  // TODO: remove placeholder service when all collections have a src href
  const imgSrc =
    assets?.thumbnail?.href || `https://via.placeholder.com/${placeholder}`;

  return <img style={style} src={imgSrc} alt="Dataset thumbnail" />;
};

export default AssetThumbnail;
