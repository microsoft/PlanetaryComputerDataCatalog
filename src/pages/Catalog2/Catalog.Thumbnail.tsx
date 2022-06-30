import { IImageStyles, Image, ImageFit } from "@fluentui/react";

interface CollectionThumbnailProps {
  assets: Record<string, any>;
}

export const CatalogCollectionThumbnail = ({ assets }: CollectionThumbnailProps) => {
  const placeholderHref = "https://via.placeholder.com/267?text=Missing+thumbnail";
  const thumbnailHref = assets?.thumbnail?.href;

  return (
    <Image
      src={thumbnailHref || placeholderHref}
      alt="Dataset thumbnail"
      styles={imageStyles}
      imageFit={ImageFit.cover}
      data-cy="catalog-collection-thumb"
    />
  );
};

const imageStyles: Partial<IImageStyles> = {
  image: {
    height: 150,
    width: 267,
    borderRadius: 2,
  },
};
