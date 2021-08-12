import { IStacAsset, IStacItem } from "types/stac";

interface ItemPreviewProps {
  item: IStacItem;
}

const thumbnailImageTypes = ["image/png", "image/jpg", "image/jpeg"];

const assetThumbCheck = (roleKey: string) => {
  return (asset: IStacAsset): boolean => {
    return (
      !!asset?.roles?.includes(roleKey) &&
      thumbnailImageTypes.includes(asset.type || "")
    );
  };
};

const isThumbnailAsset = assetThumbCheck("thumbnail");
const isRenderedPreviewAsset = assetThumbCheck("overview");

const ItemPreview = ({ item }: ItemPreviewProps) => {
  // Get a thumbnail asset, either a absolute url to an image or a preview
  // endpoint that will generate one on the fly
  const thumbAsset = Object.values(item.assets).find(
    asset => isThumbnailAsset(asset) || isRenderedPreviewAsset(asset)
  );

  if (thumbAsset?.href) {
    return (
      <img
        src={thumbAsset.href}
        alt={`Rendered thumbnail for item: ${item.id}`}
        style={{
          borderRight: "1px solid #ccc",
          height: "100%",
          width: "50px",
        }}
      />
    );
  }
  return null;
};

export default ItemPreview;
