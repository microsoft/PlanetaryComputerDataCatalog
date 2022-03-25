interface Props {
  assets: Record<string, any>;
}
const AssetThumbnail = ({ assets }: Props) => {
  const placeholderHref = "https://via.placeholder.com/350?text=Missing+thumbnail";
  // Many collections do not have role === "thumbnail"
  const thumbnailHref = assets?.thumbnail?.href;

  return (
    <div className="responsive-container-wide">
      <img src={thumbnailHref || placeholderHref} alt="Dataset thumbnail" />
    </div>
  );
};

export default AssetThumbnail;
