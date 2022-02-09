import { Link, Stack, Text, useTheme } from "@fluentui/react";
import { useExploreSelector } from "pages/Explore/state/hooks";
import { selectCurrentMosaic } from "pages/Explore/state/mosaicSlice";

interface MessageProps {
  onClick: () => void;
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

export const ZoomMessage = ({ onClick }: MessageProps) => {
  return (
    <MapMessage>
      <Link onClick={onClick}>Zoom in</Link> to see layer
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
