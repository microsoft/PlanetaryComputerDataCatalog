import { useEffect } from "react";
import { Panel, PanelType, Separator } from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";

import { IStacItem } from "../../../types/stac";
import SimpleKeyValueList from "../../../components/controls/SimpleKeyValueList";
import ItemPreview from "./ItemPreview";

type ItemPanelProps = {
  selectedItems: Array<IStacItem> | undefined;
};

const ItemPanel = ({ selectedItems }: ItemPanelProps) => {
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);

  useEffect(() => {
    if (selectedItems) {
      openPanel();
    }
  }, [selectedItems, openPanel]);

  const content = selectedItems?.length ? (
    <>
      <h3>{selectedItems[0].id}</h3>
      <Separator />
      <SimpleKeyValueList object={selectedItems[0]} />
      <Separator />
      <div style={{ maxWidth: 300 }}>
        <ItemPreview item={selectedItems[0]} />
      </div>

      <Separator />
      <SimpleKeyValueList object={selectedItems[0].properties} />
    </>
  ) : (
    <p>No items selected</p>
  );

  return (
    <Panel
      isLightDismiss
      isOpen={isOpen && !!selectedItems?.length}
      onDismiss={dismissPanel}
      type={PanelType.customNear}
      customWidth={"500px"}
      closeButtonAriaLabel="Close Item Detail Panel"
    >
      {content}
    </Panel>
  );
};

export default ItemPanel;
