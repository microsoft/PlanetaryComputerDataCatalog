import { IButtonStyles, IconButton } from "@fluentui/react";
import { useConst, useId, useBoolean } from "@fluentui/react-hooks";
import { SidebarPanels } from "pages/Explore/enums";

import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { setSidebarPanel } from "pages/Explore/state/mapSlice";
import { selectCurrentMosaic } from "pages/Explore/state/mosaicSlice";
import { isValidCollection } from "../../exporters/AnimationExporter/helpers";
import QueryInfo from "../QueryInfo";

export const SearchResultHeaderMenu: React.FC = () => {
  const dispatch = useExploreDispatch();
  const { collection } = useExploreSelector(selectCurrentMosaic);
  const [isQueryInfoVisible, { toggle }] = useBoolean(false);
  const buttonId = useId("explore-results-menu-button");

  const menuProps = useConst({
    items: [
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
        key: "animate",
        text: "Generate timelapse animation",
        ariaLabel: "Generate timelapse animation base on current filter settings",
        iconProps: { iconName: "PlaybackRate1x" },
        onClick: () => {
          dispatch(setSidebarPanel(SidebarPanels.animation));
        },
        disabled: isValidCollection(collection),
      },
      {
        key: "image",
        text: "Generate snapshot image",
        ariaLabel: "Generate timelapse animation base on current filter settings",
        iconProps: { iconName: "Photo2" },
        onClick: () => {
          dispatch(setSidebarPanel(SidebarPanels.image));
        },
        disabled: isValidCollection(collection),
      },
    ],
  });

  return (
    <>
      {isQueryInfoVisible && (
        <QueryInfo onDismiss={toggle} targetElementId={buttonId} />
      )}
      <IconButton
        id={buttonId}
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
