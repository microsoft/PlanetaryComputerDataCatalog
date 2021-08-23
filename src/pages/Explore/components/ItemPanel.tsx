import { useEffect } from "react";
import { Panel, PanelType, Separator } from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";

import SimpleKeyValueList from "components/controls/SimpleKeyValueList";
import ItemPreview from "./ItemPreview";
import { useExploreSelector } from "./state/hooks";

const ItemPanel = () => {
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
  const selectedItem = useExploreSelector(s => s.detail.selectedItem);

  useEffect(() => {
    if (selectedItem) {
      openPanel();
    }
  }, [selectedItem, openPanel]);

  const content = selectedItem ? (
    <>
      <h3>{selectedItem.id}</h3>
      <Separator />
      <SimpleKeyValueList object={selectedItem} />
      <Separator />
      <div style={{ maxWidth: 300 }}>
        <ItemPreview item={selectedItem} />
      </div>

      <Separator />
      <SimpleKeyValueList object={selectedItem.properties} />
    </>
  ) : (
    <p>No items selected</p>
  );

  return (
    <Panel
      isBlocking={false}
      isOpen={isOpen && !!selectedItem}
      onDismiss={dismissPanel}
      type={PanelType.customNear}
      customWidth={"33%"}
      closeButtonAriaLabel="Close Item Detail Panel"
    >
      {content}
    </Panel>
  );
};

export default ItemPanel;
