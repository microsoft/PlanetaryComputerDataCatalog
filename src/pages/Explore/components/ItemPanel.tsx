import { useEffect } from "react";
import {
  Panel,
  PanelType,
  Pivot,
  PivotItem,
  Separator,
  Text,
  useTheme,
} from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";

import ItemPreview from "./ItemPreview";
import { useExploreDispatch, useExploreSelector } from "../state/hooks";
import { clearSelectedItem } from "../state/detailSlice";
import { stacFormatter } from "utils/stac";

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
    <>
      <ItemPreview item={item} size={500} />
      <Text
        variant={"large"}
        styles={{ root: { fontWeight: 600, overflowWrap: "anywhere" } }}
        block
      >
        {item.id}
      </Text>
      <Text variant={"mediumPlus"} styles={{ root: { fontWeight: 400 } }} block>
        {collectionName}
      </Text>
      <Separator />
      <Pivot styles={{ link: { width: "50%" } }}>
        <PivotItem headerText="Metadata">
          {item.properties &&
            Object.entries(item.properties).map(([key, val]) => {
              return (
                <div
                  key={key}
                  style={{
                    padding: "4px 0",
                    borderTop: "1px solid",
                    borderTopColor: theme.palette.neutralLight,
                  }}
                >
                  <Text block styles={{ root: { fontWeight: 500 } }}>
                    {stacFormatter.label(key)}
                  </Text>
                  <Text>{stacFormatter.format(val, key, item)}</Text>
                </div>
              );
            })}
        </PivotItem>
        <PivotItem headerText="Assets">
          {item.assets &&
            Object.entries(item.assets).map(([key, asset]) => {
              return (
                <div
                  key={key}
                  style={{
                    padding: "4px 0",
                    borderTop: "1px solid",
                    borderTopColor: theme.palette.neutralLight,
                  }}
                >
                  <Text block styles={{ root: { fontWeight: 500 } }}>
                    {asset.title}
                  </Text>
                  <Text>{asset.description}</Text>
                </div>
              );
            })}
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
