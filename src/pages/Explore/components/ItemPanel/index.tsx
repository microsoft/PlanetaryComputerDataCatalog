import { useEffect } from "react";
import { Panel, PanelType, Pivot, PivotItem } from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";

import ItemPreview from "../ItemPreview";
import { useExploreDispatch, useExploreSelector } from "../../state/hooks";
import { clearSelectedItem } from "../../state/detailSlice";
import HeaderCard from "./HeaderCard";
import MetadataList from "./MetadataList";
import AssetList from "./AssetList";

const ItemPanel = () => {
  const dispatch = useExploreDispatch();
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
  const item = useExploreSelector(s => s.detail.selectedItem);
  const collectionName = useExploreSelector(s => s.mosaic.collection?.title);

  useEffect(() => {
    if (item) {
      openPanel();
    }
  }, [item, openPanel]);

  const content = item ? (
    <>
      <ItemPreview item={item} size={500} />
      <HeaderCard collectionName={collectionName} item={item} />
      <Pivot styles={{ link: { width: "50%" } }}>
        <PivotItem headerText="Metadata">
          <MetadataList item={item} />
        </PivotItem>
        <PivotItem headerText="Assets">
          <AssetList item={item} />
        </PivotItem>
      </Pivot>
    </>
  ) : (
    <p>No items selected</p>
  );

  return (
    <Panel
      isBlocking={false}
      isOpen={isOpen && !!item}
      onDismiss={dismissPanel}
      type={PanelType.customNear}
      customWidth={"520px"}
      closeButtonAriaLabel="Close Item Detail Panel"
      onDismissed={() => dispatch(clearSelectedItem())}
    >
      {content}
    </Panel>
  );
};

export default ItemPanel;
