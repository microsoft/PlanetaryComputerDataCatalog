import {
  Image,
  ImageFit,
  ImageLoadState,
  Shimmer,
  ShimmerElementType,
  useTheme,
} from "@fluentui/react";
import { useCallback } from "react";
import { useBoolean } from "react-use";
import { IStacItem } from "types/stac";
import { useItemPreviewUrl } from "utils";
import { useExploreSelector } from "../state/hooks";
import { selectCurrentMosaic } from "../state/mosaicSlice";
import collections from "config/datasets.yml";

interface ItemPreviewProps {
  item: IStacItem;
  size?: number;
  border?: "top" | "side";
}

const ItemPreview = ({ item, size = 100, border = "side" }: ItemPreviewProps) => {
  const theme = useTheme();
  const [loading, setLoading] = useBoolean(true);
  const { renderOption } = useExploreSelector(selectCurrentMosaic);

  const handleStateChange = useCallback(
    (state: ImageLoadState) => {
      setLoading(state === ImageLoadState.notLoaded);
    },
    [setLoading]
  );

  const previewAssetUrl = useItemPreviewUrl(item, renderOption, size);

  // Check that the item assets have an asset with a rel of preview
  const hasPreviewAsset = Object.values(item.assets).some(asset =>
    asset.roles?.includes("overview")
  );

  const previewUrl = hasPreviewAsset
    ? previewAssetUrl
    : collections[item.collection]?.defaultPreviewImage;

  if (!previewUrl) return null;
  if (!renderOption) return null;

  return (
    <>
      {loading && (
        <Shimmer
          shimmerColors={{
            background: theme.palette.neutralLight,
            shimmer: theme.palette.white,
            shimmerWave: theme.palette.neutralLighter,
          }}
          shimmerElements={[
            { type: ShimmerElementType.line, height: size, width: size },
          ]}
        />
      )}
      <Image
        src={previewUrl}
        alt={`Rendered thumbnail for item: ${item.id}`}
        imageFit={ImageFit.contain}
        onLoadingStateChange={handleStateChange}
        styles={{
          root: {
            background: theme.palette.black,
            display: loading ? "none" : "block",
            maxWidth: size,
            maxHeight: size,
            height: size,
          },
        }}
        data-cy="preview-thumbnail"
      />
    </>
  );
};

export default ItemPreview;
