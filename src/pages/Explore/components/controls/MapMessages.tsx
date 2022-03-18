import {
  FontSizes,
  getTheme,
  Icon,
  IIconStyles,
  ITextStyles,
  Link,
  Stack,
  Text,
  useTheme,
} from "@fluentui/react";
import { useExploreSelector } from "pages/Explore/state/hooks";
import { selectCurrentMosaic } from "pages/Explore/state/mosaicSlice";
import { ILayerZoomVisibility } from "pages/Explore/types";
import { useState } from "react";

interface MessageProps {
  onClick: () => void;
  layerVisibility: ILayerZoomVisibility;
}

const MapMessage: React.FC = ({ children }) => {
  const theme = useTheme();

  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: "50%",
        transform: "translate(-50%, 0)",
        zIndex: 1,
        padding: "7px 10px",
        borderRadius: 5,
        border: "1px solid",
        borderColor: theme.semanticColors.primaryButtonBorder,
        backgroundColor: theme.semanticColors.bodyBackground,
        boxShadow: theme.effects.elevation16,
      }}
    >
      {children}
    </div>
  );
};

export const ZoomMessage: React.FC<MessageProps> = ({
  onClick,
  layerVisibility,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const isCurrentLayerInvisible = Boolean(layerVisibility.current);
  const hasOtherNonVisibleLayers = layerVisibility.others.length > 0;
  const hasBoth = hasOtherNonVisibleLayers && isCurrentLayerInvisible;

  const pinnedLayerMsg = "Some pinned layers not visible at this zoom level";
  return (
    <MapMessage>
      {isCurrentLayerInvisible && (
        <Text block style={{ textAlign: "center" }}>
          <Link onClick={onClick}>Zoom in</Link> to see search results
        </Text>
      )}

      {hasOtherNonVisibleLayers && (
        <Stack
          horizontal
          tokens={{ childrenGap: 4 }}
          onMouseLeave={() => {
            setShowDetails(false);
          }}
          verticalAlign="center"
        >
          <Icon
            iconName="Info"
            aria-label={pinnedLayerMsg}
            styles={warningIconStyles}
            onMouseEnter={() => {
              setShowDetails(true);
            }}
          />
          {(showDetails || hasBoth) && (
            <Text styles={warningTextStyles}>{pinnedLayerMsg}</Text>
          )}
        </Stack>
      )}
    </MapMessage>
  );
};

export const ExtentMessage = ({ onClick }: MessageProps) => {
  const { collection } = useExploreSelector(selectCurrentMosaic);

  return (
    <MapMessage>
      <Stack horizontalAlign={"center"} styles={{ root: { textAlign: "center" } }}>
        <Text block>This area doesn't include data from</Text>
        <Text block styles={{ root: { fontStyle: "italic" } }}>
          {collection?.title}
        </Text>
        <Text block styles={{ root: { paddingTop: 5 } }}>
          <Link onClick={onClick}>Zoom to</Link> the valid extent.
        </Text>
      </Stack>
    </MapMessage>
  );
};

const theme = getTheme();
const warningIconStyles: IIconStyles = {
  root: {
    fontSize: FontSizes.small,
    color: theme.palette.neutralSecondary,
  },
};

const warningTextStyles: ITextStyles = {
  root: {
    fontSize: FontSizes.small,
    fontStyle: "italic",
  },
};
