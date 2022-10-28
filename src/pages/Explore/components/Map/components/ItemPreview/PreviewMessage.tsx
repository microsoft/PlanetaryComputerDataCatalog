import {
  getTheme,
  Icon,
  IIconStyles,
  ISeparatorStyles,
  IStackStyles,
  ITextStyles,
  Separator,
  Stack,
  Text,
  TooltipHost,
} from "@fluentui/react";
import atlas from "azure-maps-control";
import { ItemTime } from "pages/Explore/components/controls/ItemTime";
import { resetDetail } from "pages/Explore/state/detailSlice";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { restorePreviousCenterAndZoom } from "pages/Explore/state/mapSlice";
import React from "react";
import { MOBILE_WIDTH } from "utils/constants";
import { MapMessage } from "../../../controls/MapMessages";
import { truncateMiddle } from "./helpers";
import { PreviewActionBar } from "./PreviewActionBar";
import { PreviewMessageCloseButton } from "./PreviewMessageCloseButton";

interface PreviewMessageProps {
  mapRef: React.MutableRefObject<atlas.Map | null>;
}

export const PreviewMessage: React.FC<PreviewMessageProps> = ({ mapRef }) => {
  const dispatch = useExploreDispatch();
  const { selectedItem, previewMode } = useExploreSelector(s => s.detail);

  if (!selectedItem || !previewMode.enabled) {
    return null;
  }

  const handleClose = (restoreExtent: boolean = false) => {
    if (restoreExtent) {
      dispatch(restorePreviousCenterAndZoom());
    }
    dispatch(resetDetail());
  };

  const description =
    "Item preview locks your current search and allows you visualize individual results on the map, rather than the default mosaic. Close out of preview mode to continue your search.";
  const header = (
    <Stack
      horizontal
      horizontalAlign="space-between"
      verticalAlign="center"
      styles={containerStyles}
    >
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 4 }}>
        <Text block styles={headerTitleStyles}>
          Item preview
        </Text>
        <TooltipHost content={description}>
          <Icon iconName="info" styles={tooltipIconStyles} />
        </TooltipHost>
      </Stack>
      <PreviewMessageCloseButton onClick={handleClose} />
    </Stack>
  );

  const content = (
    <Stack tokens={{ childrenGap: 4 }}>
      <Text block title={`Selected item id: ${selectedItem.id}`}>
        {truncateMiddle(selectedItem.id)}
      </Text>
      <div
        style={{
          fontSize: 13,
          color: theme.palette.neutralSecondary,
        }}
      >
        <ItemTime item={selectedItem} />
      </div>
    </Stack>
  );

  return (
    <MapMessage>
      {header}
      <Separator styles={separatorStyles} />
      {content}
      <PreviewActionBar
        item={selectedItem}
        mapRef={mapRef}
        previewModeState={previewMode}
      />
    </MapMessage>
  );
};

const theme = getTheme();

const headerTitleStyles: ITextStyles = {
  root: {
    textAlign: "left",
    fontWeight: 500,
  },
};

const containerStyles: IStackStyles = {
  root: {
    minWidth: 320,
    [`@media(max-width: ${MOBILE_WIDTH}px)`]: {
      maxWidth: 250,
    },
  },
};

const tooltipIconStyles: IIconStyles = {
  root: {
    cursor: "default",
    visibility: "hidden",
  },
};

const separatorStyles: Partial<ISeparatorStyles> = {
  root: {
    padding: 4,
  },
  content: {
    display: "block",
  },
};
