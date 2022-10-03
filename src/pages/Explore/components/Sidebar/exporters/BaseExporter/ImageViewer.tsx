import { useCallback } from "react";
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
import {
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TwitterShareButton,
  TwitterIcon,
} from "next-share";

import { ImageExportResponse } from "./types";

interface ImageViewerProps {
  ImageResponse: ImageExportResponse;
  collectionId: string;
  onClose: () => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  ImageResponse,
  collectionId,
  onClose,
}) => {
  const handleDownload = useCallback(() => {
    window.open(ImageResponse.url);
  }, [ImageResponse.url]);

  const shareUrl = ImageResponse.url;

  return (
    <Modal isOpen={true} onDismiss={onClose}>
      <Stack horizontal horizontalAlign="space-between">
        <h3 style={headerStyle}>Image viewer</h3>
        <IconButton
          styles={iconButtonStyles}
          iconProps={cancelIcon}
          ariaLabel="Close popup modal"
          onClick={onClose}
        />
      </Stack>
      <Separator />
      <div style={viewerBodyStyle}>
        <Stack
          horizontal
          horizontalAlign="start"
          tokens={stackTokens}
          verticalAlign="center"
        >
          <Label>Share:</Label>
        </Stack>

        <Stack
          horizontal
          horizontalAlign="start"
          tokens={stackTokens}
          verticalAlign="center"
        >
          <div style={urlCopyStyle}>
            <code>{shareUrl}</code>
          </div>
          <IconButton
            title="Download image"
            iconProps={downloadIconProps}
            onClick={handleDownload}
          />
          <LinkedinShareButton url={shareUrl}>
            <LinkedinIcon size={20} round />
          </LinkedinShareButton>
          <TwitterShareButton
            url={shareUrl}
            title={`From ${collectionId}`}
            hashtags={[collectionId, "planetarycomputer"]}
          >
            <TwitterIcon size={20} round />
          </TwitterShareButton>
          <FacebookShareButton
            url={shareUrl}
            quote={"next-share is a social share buttons for your next React apps."}
            hashtag={"#nextshare"}
          >
            <FacebookIcon size={20} round />
          </FacebookShareButton>
        </Stack>
      </div>
      <Image
        src={ImageResponse.url}
        styles={imageStyles}
        alt={"Timelapse Image"}
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
