import React from "react";

const AssetThumbnail = ({
  assets,
  // style = { maxWidth: "100%", maxHeight: "100%", objectFit: "contain" },
}) => {
  const imgSrc = assets?.thumbnail?.href;

  if (imgSrc) {
    return (
      <div className="responsive-container-wide">
        <img src={imgSrc} alt="Dataset thumbnail" />
      </div>
    );
  }
  return null;
};

export default AssetThumbnail;
