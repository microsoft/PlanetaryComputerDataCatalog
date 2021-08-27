import { useCallback, useEffect } from "react";
import { Panel, PanelType, Pivot, PivotItem, useTheme } from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";

import ItemPreview from "../ItemPreview";
import { useExploreDispatch, useExploreSelector } from "../../state/hooks";
import { clearSelectedItem, setShowAsLayer } from "../../state/detailSlice";
import HeaderCard from "./HeaderCard";
import MetadataList from "./MetadataList";
import AssetList from "./AssetList";

const ItemPanel = () => {
  const dispatch = useExploreDispatch();
  const theme = useTheme();
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
  const item = useExploreSelector(s => s.detail.selectedItem);
  const collectionName = useExploreSelector(s => s.mosaic.collection?.title);

  useEffect(() => {
    if (item) {
      openPanel();
    }
  }, [item, openPanel]);

  const content = item ? (
    <div
      style={{
        border: "1px solid",
        borderColor: theme.palette.neutralLight,
        borderRadius: 4,
      }}
    >
      <ItemPreview item={item} size={400} />
      <HeaderCard collectionName={collectionName} item={item} />
      <Pivot styles={{ link: { width: "50%" } }}>
        <PivotItem headerText="Metadata">
          <MetadataList item={item} />
        </PivotItem>
        <PivotItem headerText="Assets">
          <AssetList item={item} />
        </PivotItem>
      </Pivot>
    </div>
  ) : (
    <p>No items selected</p>
  );

  const handleClose = useCallback(() => {
    dispatch(clearSelectedItem());
    dispatch(setShowAsLayer(false));
  }, [dispatch]);

  return (
    <Panel
      isBlocking={false}
      isOpen={isOpen && !!item}
      onDismiss={dismissPanel}
      type={PanelType.customNear}
      customWidth={"520px"}
      closeButtonAriaLabel="Close Item Detail Panel"
      onDismissed={handleClose}
    >
      {content}
    </Panel>
  );
};

export default ItemPanel;
