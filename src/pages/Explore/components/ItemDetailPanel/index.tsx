import {
  IStackItemStyles,
  Pivot,
  PivotItem,
  StackItem,
  useTheme,
} from "@fluentui/react";

import ItemPreview from "../ItemPreview";
import { useExploreSelector } from "../../state/hooks";
import HeaderCard from "./HeaderCard";
import MetadataList from "./MetadataList";
import AssetList from "./AssetList";
import BackToListButton from "./BackToListButton";
import { CSSProperties } from "react";

const ItemDetailPanel = () => {
  const theme = useTheme();
  const item = useExploreSelector(s => s.detail.selectedItem);
  const collectionName = useExploreSelector(s => s.mosaic.collection?.title);

  const itemDetailStylesOuter: Partial<IStackItemStyles> = {
    root: {
      height: "100%",
      overflowY: "auto",
      overflowX: "clip",
    },
  };

  const itemDetailStylesInner: CSSProperties = {
    border: "1px solid",
    borderColor: theme.palette.neutralLight,
    borderRadius: 4,
    marginRight: 3,
  };

  const content = item ? (
    <div style={itemDetailStylesInner}>
      <BackToListButton />
      <div
        style={{
          minWidth: 400,
          minHeight: 400,
        }}
      >
        <ItemPreview item={item} size={400} border="top" />
      </div>
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
  ) : null;

  return (
    <StackItem className="custom-overflow" styles={itemDetailStylesOuter}>
      {content}
    </StackItem>
  );
};

export default ItemDetailPanel;
