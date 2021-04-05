import React from "react";

const images = [
  "https://ai4edatasetspublicassets.blob.core.windows.net/assets/pc_thumbnails/sentinel-2.png",
  "https://ai4edatasetspublicassets.blob.core.windows.net/assets/pc_thumbnails/naip.png",
  "https://ai4edatasetspublicassets.blob.core.windows.net/assets/pc_thumbnails/landsat.png",
  "https://ai4edatasetspublicassets.blob.core.windows.net/assets/pc_thumbnails/aster.png",
];
const ImageStrip = () => {
  return (
    <div className="home-strip-container">
      {images.map((url, idx) => (
        <img
          key={`img-strip-${idx}`}
          className="home-strip-item"
          src={url}
          alt="" // decorative images
        />
      ))}
    </div>
  );
};

export default ImageStrip;
