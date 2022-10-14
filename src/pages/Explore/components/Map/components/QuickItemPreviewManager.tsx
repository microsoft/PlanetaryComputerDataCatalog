import {
  Icon,
  IconButton,
  IIconStyles,
  Stack,
  Text,
  TooltipHost,
} from "@fluentui/react";
import { resetDetail } from "pages/Explore/state/detailSlice";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import React from "react";
import { MapMessage } from "../../controls/MapMessages";

export const QuickItemPreviewManage: React.FC = () => {
  const dispatch = useExploreDispatch();
  const {
    selectedItem,
    display: { showItemDetail },
  } = useExploreSelector(s => s.detail);

  if (!selectedItem || showItemDetail) {
    return null;
  }

  const handleClose = () => {
    dispatch(resetDetail());
  };

  const description =
    "Item preview locks your current search and allows you visualize individual results on the map, rather than the default mosaic. Close out of preview mode to continue your search.";
  const header = (
    <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 4 }}>
        <Text block style={{ textAlign: "left" }}>
          <strong>Item preview</strong>
        </Text>
        <TooltipHost content={description}>
          <Icon iconName="info" styles={tooltipIconStyles} />
        </TooltipHost>
      </Stack>
      <IconButton iconProps={{ iconName: "Cancel" }} onClick={handleClose} />
    </Stack>
  );

  const content = (
    <Text block style={{ textAlign: "center" }}>
      {selectedItem.id}
    </Text>
  );

  return (
    <MapMessage>
      {header}
      {content}
    </MapMessage>
  );
};

const tooltipIconStyles: IIconStyles = {
  root: {
    cursor: "default",
  },
};
