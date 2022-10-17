import {
  getTheme,
  IButtonStyles,
  IconButton,
  IContextualMenuProps,
} from "@fluentui/react";

interface PreviewMessageCloseButtonProps {
  onClick: (restoreExtent: boolean) => void;
}

export const PreviewMessageCloseButton: React.FC<PreviewMessageCloseButtonProps> = ({
  onClick,
}) => {
  const handleCloseRestore = () => {
    onClick(true);
  };
  const handleClose = () => {
    onClick(false);
  };

  const closeMessage = "Exit preview and keep current map extent";

  const menuItems: IContextualMenuProps = {
    items: [
      {
        key: "close-current-bounds",
        text: closeMessage,
        onClick: handleClose,
      },
      {
        key: "close-original-bounds",
        text: "Exit and return to original search extent",
        onClick: handleCloseRestore,
      },
    ],
  };

  return (
    <IconButton
      split
      title={closeMessage}
      ariaLabel={closeMessage}
      iconProps={{ iconName: "Cancel" }}
      menuProps={menuItems}
      styles={closeButtonStyles}
      onClick={handleClose}
    />
  );
};

const theme = getTheme();
const closeButtonStyles: IButtonStyles = {
  icon: {
    fontSize: 12,
  },
  root: {
    color: theme.semanticColors.bodyText,
  },
  rootHovered: {
    color: theme.semanticColors.bodyText,
  },
  menuIcon: {},
  menuIconHovered: {
    backgroundColor: theme.semanticColors.buttonBackgroundHovered,
  },
  splitButtonMenuButton: {
    color: theme.semanticColors.bodyText,
    backgroundColor: theme.semanticColors.bodyBackground,
    border: "none",
    paddingRight: 0,
  },
  splitButtonMenuIcon: {
    fontSize: 8,
    width: 18,
  },
  splitButtonDivider: {
    backgroundColor: "#c8c8c8",
    width: 1,
    right: 26,
    position: "absolute",
    top: 4,
    bottom: 4,
  },
};
