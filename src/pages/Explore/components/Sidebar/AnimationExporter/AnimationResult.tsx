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
import { removeAnimation } from "pages/Explore/state/animationSlice";
import { useExploreDispatch } from "pages/Explore/state/hooks";
import { useCallback, useState } from "react";
import { AnimationViewer } from "./AnimationViewer";

export interface AnimationResponse {
  url: string;
}

interface Props {
  animationResponse: AnimationResponse;
  collectionId: string;
}

export const AnimationResult: React.FC<Props> = ({
  animationResponse,
  collectionId,
}) => {
  const dispatch = useExploreDispatch();
  const [displayedAnimation, setDisplayedAnimation] =
    useState<AnimationResponse | null>();

  const handleViewerClose = useCallback(() => {
    setDisplayedAnimation(null);
  }, []);

  const handleViewClick = useCallback(() => {
    setDisplayedAnimation(animationResponse);
  }, [animationResponse]);

  const menuProps: IContextualMenuProps = useConst({
    onItemClick(_, item?) {
      switch (item?.key) {
        case "download":
          window.open(animationResponse.url, "_blank");
          break;
        case "delete":
          dispatch(
            removeAnimation({
              animation: animationResponse,
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
      <Link
        aria-label="Click to display full size timelapse animation"
        onClick={handleViewClick}
      >
        <Image
          styles={imageStyles}
          alt="layer animation"
          src={animationResponse.url}
          imageFit={ImageFit.contain}
        />
      </Link>
      {displayedAnimation && (
        <AnimationViewer
          animationResponse={displayedAnimation}
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
    ariaLabel: "View large timelapse animation",
  },
  {
    key: "download",
    iconProps: { iconName: "Download" },
    text: "Download full size",
    ariaLabel: "Download full size timelapse animation",
  },
  {
    key: "delete",
    text: "Remove",
    iconProps: { iconName: "Delete" },
    ariaLabel: "Remove timelapse animation",
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
