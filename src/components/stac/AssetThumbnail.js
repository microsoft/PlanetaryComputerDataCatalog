import React from "react";

const AssetThumbnail = ({
  assets,
  style = { maxWidth: "100%", objectFit: "contain" },
}) => {
  const imgSrc = assets?.thumbnail?.href;

  if (imgSrc) {
    return <img style={style} src={imgSrc} alt="Dataset thumbnail" />;
  }
  return null;
};

export default AssetThumbnail;
