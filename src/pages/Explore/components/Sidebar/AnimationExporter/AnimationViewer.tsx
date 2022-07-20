import {
  getTheme,
  IButtonStyles,
  IconButton,
  IIconProps,
  IImageStyles,
  Image,
  ImageFit,
  Label,
  Modal,
  Separator,
  Stack,
} from "@fluentui/react";
import { useCallback } from "react";
import { AnimationResponse } from "./AnimationResult";

interface AnimationViewerProps {
  animationResponse: AnimationResponse;
  onClose: () => void;
}

export const AnimationViewer: React.FC<AnimationViewerProps> = ({
  animationResponse,
  onClose,
}) => {
  const handleDownload = useCallback(() => {
    window.open(animationResponse.url);
  }, [animationResponse.url]);

  return (
    <Modal isOpen={true} onDismiss={onClose}>
      <Stack horizontal horizontalAlign="space-between">
        <h3 style={headerStyle}>Timelapse viewer</h3>
        <IconButton
          styles={iconButtonStyles}
          iconProps={cancelIcon}
          ariaLabel="Close popup modal"
          onClick={onClose}
        />
      </Stack>
      <Separator />
      <div style={viewerBodyStyle}>
        <Label>Share link:</Label>
        <Stack
          horizontal
          horizontalAlign="start"
          tokens={stackTokens}
          verticalAlign="center"
        >
          <div style={urlCopyStyle}>
            <code>{animationResponse.url}</code>
          </div>
          <IconButton
            title="Download image"
            iconProps={downloadIconProps}
            onClick={handleDownload}
          />
        </Stack>
      </div>
      <Image
        src={animationResponse.url}
        styles={imageStyles}
        alt={"Timelapse animation"}
        imageFit={ImageFit.contain}
      />
    </Modal>
  );
};

const theme = getTheme();

const cancelIcon: IIconProps = { iconName: "Cancel" };
const downloadIconProps = { iconName: "Download" };

const stackTokens = { childrenGap: 5 };
const iconButtonStyles: Partial<IButtonStyles> = {
  root: {
    color: theme.palette.neutralPrimary,
    marginTop: 12,
    marginRight: 4,
  },
  rootHovered: {
    color: theme.palette.neutralDark,
  },
};

const imageStyles: Partial<IImageStyles> = {
  root: {
    display: "flex",
    margin: 10,
    minHeight: "50vh",
    backgroundColor: theme.palette.neutralLighter,
  },
  image: {
    maxWidth: "80vw",
    maxHeight: "80vh",
    marginLeft: "auto",
    marginRight: "auto",
    height: "auto",
    width: "auto",
  },
};

const headerStyle: React.CSSProperties = {
  marginLeft: 10,
  marginBottom: 5,
};

const urlCopyStyle = {
  border: `1px solid ${theme.palette.neutralLight}`,
  borderRadius: 4,
  padding: 4,
};
const viewerBodyStyle = {
  margin: "0 10px",
};
