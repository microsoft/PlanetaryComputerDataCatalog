import { Pivot, PivotItem, StackItem, useTheme } from "@fluentui/react";

import ItemPreview from "../ItemPreview";
import { useExploreDispatch, useExploreSelector } from "../../state/hooks";
import HeaderCard from "./HeaderCard";
import MetadataList from "./MetadataList";
import AssetList from "./AssetList";
import BackToListButton from "./BackToListButton";

const ItemDetailPanel = () => {
  const theme = useTheme();
  const item = useExploreSelector(s => s.detail.selectedItem);
  const collectionName = useExploreSelector(s => s.mosaic.collection?.title);

  const content = item ? (
    <div
      style={{
        border: "1px solid",
        borderColor: theme.palette.neutralLight,
        borderRadius: 4,
        height: "100%",
        overflowY: "auto",
        overflowX: "clip",
      }}
    >
      <BackToListButton />
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
  ) : null;

  return <StackItem styles={{ root: { height: "100%" } }}>{content}</StackItem>;
};

export default ItemDetailPanel;
