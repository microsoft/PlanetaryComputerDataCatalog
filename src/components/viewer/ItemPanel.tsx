import { useEffect } from "react";
import { Panel, PanelType, Separator } from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";

import { IStacItem } from "../../types/stac";
import SimpleKeyValueList from "../controls/SimpleKeyValueList";

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

  const thumbnail = selectedItems?.length
    ? Object.values(selectedItems[0].assets)
        .map((v: any) => (v.roles?.includes("thumbnail") ? v.href : null))
        .filter(href => href !== null)
    : null;

  const content = selectedItems?.length ? (
    <>
      <h3>{selectedItems[0].id}</h3>
      <Separator />
      <SimpleKeyValueList object={selectedItems[0]} />
      {thumbnail?.length && (
        <>
          <Separator />
          <img src={thumbnail[0]} style={{ maxHeight: 300 }} alt="Item thumbnail" />
        </>
      )}
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
