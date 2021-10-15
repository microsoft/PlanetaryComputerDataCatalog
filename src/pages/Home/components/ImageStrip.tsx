const rootUrl =
  "https://ai4edatasetspublicassets.azureedge.net/assets/pc_thumbnails";

const images = [
  "sentinel-2.png",
  "hgb.png",
  "landsat.png",
  "terraclimate.png",
  "aster.png",
  "hrea.png",
  "naip.png",
  "nasadem.png",
];

const ImageStrip = () => {
  return (
    <div className="home-strip-container">
      {images.map((filename, idx) => (
        <img
          key={`img-strip-${idx}`}
          className="home-strip-item"
          src={`${rootUrl}/${filename}`}
          alt="" // decorative images
        />
      ))}
    </div>
  );
};

export default ImageStrip;
