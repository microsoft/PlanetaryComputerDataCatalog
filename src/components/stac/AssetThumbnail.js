import React from "react";

const AssetThumbnail = ({ assets }) => {
  return assets?.thumbnail?.href ? (
    <img src={assets.thumbnail.href} alt="Dataset thumbnail" />
  ) : null;
};

export default AssetThumbnail;
