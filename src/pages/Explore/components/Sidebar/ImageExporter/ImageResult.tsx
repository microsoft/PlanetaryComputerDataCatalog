import {
  getTheme,
  IButtonStyles,
  IconButton,
  IContextualMenuItem,
  IContextualMenuProps,
  IImageStyles,
  Image,
  ImageFit,
  IStackItemStyles,
  Link,
  StackItem,
} from "@fluentui/react";
import { useConst } from "@fluentui/react-hooks";
import { removeImage } from "pages/Explore/state/imageSlice";
import { useExploreDispatch } from "pages/Explore/state/hooks";
import { useCallback, useState } from "react";
import { ImageViewer } from "./ImageViewer";

export interface ImageResponse {
  url: string;
}

interface Props {
  ImageResponse: ImageResponse;
  collectionId: string;
}

export const ImageResult: React.FC<Props> = ({ ImageResponse, collectionId }) => {
  const dispatch = useExploreDispatch();
  const [displayedImage, setDisplayedImage] = useState<ImageResponse | null>();

  const handleViewerClose = useCallback(() => {
    setDisplayedImage(null);
  }, []);

  const handleViewClick = useCallback(() => {
    setDisplayedImage(ImageResponse);
  }, [ImageResponse]);

  const menuProps: IContextualMenuProps = useConst({
    onItemClick(_, item?) {
      switch (item?.key) {
        case "download":
          window.open(ImageResponse.url, "_blank");
          break;
        case "delete":
          dispatch(
            removeImage({
              image: ImageResponse,
              collectionId: collectionId,
            })
          );
          break;
        case "view":
          handleViewClick();
          break;
        default:
      }
    },
    shouldFocusOnMount: true,
    items: menuItems,
  });

  return (
    <StackItem styles={rowStyles}>
      <IconButton
        menuProps={menuProps}
        styles={iconButtonStyles}
        iconProps={iconButtonProps}
      />
      <Link aria-label="Click to display full size image" onClick={handleViewClick}>
        <Image
          styles={imageStyles}
          alt="layer Image"
          src={ImageResponse.url}
          imageFit={ImageFit.contain}
        />
      </Link>
      {displayedImage && (
        <ImageViewer
          ImageResponse={displayedImage}
          collectionId={collectionId}
          onClose={handleViewerClose}
        />
      )}
    </StackItem>
  );
};

const menuItems: IContextualMenuItem[] = [
  {
    key: "view",
    iconProps: { iconName: "FullScreen" },
    text: "View larger version",
    ariaLabel: "View large image",
  },
  {
    key: "download",
    iconProps: { iconName: "Download" },
    text: "Download full size",
    ariaLabel: "Download full size image",
  },
  {
    key: "delete",
    text: "Remove",
    iconProps: { iconName: "Delete" },
    ariaLabel: "Remove image",
  },
];

const theme = getTheme();
const rowStyles: IStackItemStyles = {
  root: {
    position: "relative",
  },
};

const imageStyles: Partial<IImageStyles> = {
  root: {
    backgroundColor: "black",
    width: 180,
    height: 180,
    borderRadius: "4px",
  },
  image: {
    maxWidth: 180,
    maxHeight: 180,
  },
};

const iconButtonStyles: IButtonStyles = {
  root: {
    border: `1px solid ${theme.palette.neutralQuaternary}`,
    position: "absolute",
    right: 4,
    top: 4,
    zIndex: 1,
    borderRadius: 20,
    padding: 3,
    color: theme.semanticColors.bodyText,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  rootFocused: {
    padding: 3,
  },
  menuIcon: { display: "none" },
};
const iconButtonProps = { iconName: "More" };
