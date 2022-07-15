import {
  getTheme,
  IButtonStyles,
  IconButton,
  IContextualMenuProps,
  IImageStyles,
  Image,
  ImageFit,
  IStackItemStyles,
  StackItem,
} from "@fluentui/react";
import { useConst } from "@fluentui/react-hooks";

export interface AnimationResponse {
  url: string;
}

interface Props {
  animationResponse: AnimationResponse;
  idx: number;
}

export const AnimationResult: React.FC<Props> = ({ animationResponse, idx }) => {
  const menuProps: IContextualMenuProps = useConst({
    onItemClick(_, item?) {
      switch (item?.key) {
        case "download":
          window.open(animationResponse.url, "_blank");
          break;
        case "delete":
          break;
        case "view":
          break;
        case "share":
          break;
        default:
      }
    },
    shouldFocusOnMount: true,
    items: [
      {
        key: "view",
        iconProps: { iconName: "FullScreen" },
        text: "View full size",
      },
      {
        key: "download",
        iconProps: { iconName: "Download" },
        text: "Download full size",
      },
      { key: "share", iconProps: { iconName: "Share" }, text: "Share" },
      {
        key: "delete",
        text: "Remove",
        iconProps: { iconName: "Delete" },
      },
    ],
  });

  return (
    <StackItem styles={rowStyles}>
      <IconButton
        menuProps={menuProps}
        styles={iconButtonStyles}
        iconProps={iconButtonProps}
      />
      <Image
        styles={imageStyles}
        alt="layer animation"
        src={animationResponse.url}
        imageFit={ImageFit.contain}
      />
    </StackItem>
  );
};

const theme = getTheme();
const rowStyles: IStackItemStyles = {
  root: {
    position: "relative",
    border: `1px solid ${theme.palette.neutralLight}`,
    borderRadius: "4px",
  },
};

const imageStyles: Partial<IImageStyles> = {
  root: {
    backgroundColor: "black",
    width: 180,
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
    right: 10,
    top: 10,
    zIndex: 1,
    borderRadius: 20,
    color: theme.semanticColors.bodyText,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  menuIcon: { display: "none" },
};
const iconButtonProps = { iconName: "More" };
