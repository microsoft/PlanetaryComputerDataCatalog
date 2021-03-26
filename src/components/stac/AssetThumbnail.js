import React from "react";

const AssetThumbnail = ({ assets, style = {} }) => {
  const imgSrc = assets?.thumbnail?.href;

  if (imgSrc) {
    return <img style={style} src={imgSrc} alt="Dataset thumbnail" />;
  }
  return null;
};

export default AssetThumbnail;
