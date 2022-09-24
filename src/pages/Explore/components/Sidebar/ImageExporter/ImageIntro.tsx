import { getTheme, IconButton, Separator, Stack, Text } from "@fluentui/react";
import { IMosaicRenderOption } from "pages/Explore/types";
import { IStacCollection } from "types/stac";

interface Props {
  collection: IStacCollection | null;
  renderOption: IMosaicRenderOption | null;
  handleClose: () => void;
}
export const ImageIntro: React.FC<Props> = ({
  collection,
  renderOption,
  handleClose,
}) => {
  if (!collection) return null;

  return (
    <>
      <Stack horizontal horizontalAlign="space-between">
        <h3 style={headerStyles}>Export Image</h3>
        <IconButton
          title="Close"
          aria-label="Close Image export panel"
          styles={buttonStyles}
          iconProps={iconProps}
          onClick={handleClose}
        />
      </Stack>
      <Text>Generate an image of this dataset. </Text>
      <Text>
        The image will be generated using the current search. Draw a bounding box for
        the image and select the image size. The image returned will be at the size
        provided and contain the area drawn in the bounding box. Note that the image
        bounds may be slightly larger than the bounding box if the aspect ratios do
        not match.
      </Text>
      <Separator styles={{ root: { padding: "0 4px" } }} />
      <h4 style={headerStyles}>
        {collection.title || collection.id}, {renderOption?.name}
      </h4>
    </>
  );
};

const theme = getTheme();

const buttonStyles = {
  root: { color: theme.semanticColors.bodyText },
  rootHovered: {
    color: theme.palette.neutralDark,
  },
};
const iconProps = { iconName: "Cancel" };
const headerStyles = { marginBottom: 4 };
