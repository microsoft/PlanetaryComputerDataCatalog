import { Text } from "@fluentui/react";
import PanelControl from "../PanelControl";

const LegendControl = () => {
  const title = "Legend";

  return (
    <PanelControl label={title} iconName="ThumbnailView" bottom={2} left={2}>
      <Text block styles={{ root: { padding: 4 } }}>
        Legend currently unavailable
      </Text>
    </PanelControl>
  );
};

export default LegendControl;
