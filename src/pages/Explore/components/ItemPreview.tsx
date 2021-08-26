import { Image, ImageFit, useTheme } from "@fluentui/react";
import { IStacItem } from "types/stac";
import { makeItemPreviewUrl } from "utils";
import { useExploreSelector } from "../state/hooks";

interface ItemPreviewProps {
  item: IStacItem;
  size?: number;
}

const ItemPreview = ({ item, size = 100 }: ItemPreviewProps) => {
  const theme = useTheme();
  const renderOption = useExploreSelector(s => s.mosaic.renderOption);

  if (!renderOption) return null;

  const previewUrl = makeItemPreviewUrl(item, renderOption, size);

  return (
    <Image
      src={previewUrl}
      alt={`Rendered thumbnail for item: ${item.id}`}
      imageFit={ImageFit.contain}
      styles={{
        root: {
          background: theme.palette.neutralLighterAlt,
          height: size,
        },
      }}
    />
  );
};

export default ItemPreview;
