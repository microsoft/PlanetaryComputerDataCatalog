import {
  ContextualMenuItemType,
  IButtonStyles,
  IconButton,
  IContextualMenuProps,
} from "@fluentui/react";
import { useId, useBoolean } from "@fluentui/react-hooks";
import { SidebarPanels } from "pages/Explore/enums";

import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { setSidebarPanel } from "pages/Explore/state/mapSlice";
import { selectCurrentMosaic } from "pages/Explore/state/mosaicSlice";
import { isValidCollection } from "../../exporters/AnimationExporter/helpers";
import QueryInfo from "../QueryInfo";
import { useSortMenuItem } from "./useSortMenuItem";

export const SearchResultHeaderMenu: React.FC = () => {
  const dispatch = useExploreDispatch();
  const { collection, renderOption } = useExploreSelector(selectCurrentMosaic);
  const [isQueryInfoVisible, { toggle }] = useBoolean(false);
  const sortItem = useSortMenuItem();
  const buttonId = useId("explore-results-menu-button");

  const isValidExport = isValidCollection(collection, renderOption);
  const invalidExportMsg = "This layer isn't available for image export.";

  const menuProps: IContextualMenuProps = {
    items: [
      sortItem,
      {
        key: "separator1",
        itemType: ContextualMenuItemType.Divider,
      },
      {
        key: "details",
        text: "Filter details",
        ariaLabel: "Details of current filter settings",
        iconProps: { iconName: "Info" },
        onClick: toggle,
        "data-cy": "query-detail-button",
      },
      {
        key: "collection",
        text: `Data Catalog page (${collection?.id})`,
        iconProps: { iconName: "ProductCatalog" },
        onClick: () => {
          window.open(
            `//${window.location.host}/dataset/${collection?.id}`,
            "_blank"
          );
        },
      },
      {
        key: "exports",
        text: "Export",
        itemType: ContextualMenuItemType.Divider,
      },
      {
        key: "animate",
        text: "Generate timelapse animation",
        ariaLabel: "Generate timelapse animation base on current filter settings",
        title: !isValidExport ? invalidExportMsg : undefined,
        iconProps: { iconName: "PlaybackRate1x" },
        onClick: () => {
          dispatch(setSidebarPanel(SidebarPanels.animation));
        },
        disabled: !isValidExport,
      },
      {
        key: "image",
        text: "Generate snapshot image",
        ariaLabel: "Generate timelapse animation base on current filter settings",
        title: !isValidExport ? invalidExportMsg : undefined,
        iconProps: { iconName: "Photo2" },
        onClick: () => {
          dispatch(setSidebarPanel(SidebarPanels.image));
        },
        disabled: !isValidExport,
      },
    ],
  };

  return (
    <>
      {isQueryInfoVisible && (
        <QueryInfo onDismiss={toggle} targetElementId={buttonId} />
      )}
      <IconButton
        id={buttonId}
        title="More options"
        styles={iconButtonStyles}
        iconProps={iconProps}
        menuProps={menuProps}
        data-cy="explore-results-menu-button"
      />
    </>
  );
};

const iconProps = { iconName: "More" };
const iconButtonStyles: IButtonStyles = {
  menuIcon: { display: "none" },
};
