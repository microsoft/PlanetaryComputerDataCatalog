import { MessageBar, PivotItem, Text } from "@fluentui/react";
import NewTabLink from "components/controls/NewTabLink";
import { IStacItem } from "types/stac";
import { mediaTypeOverride } from "utils/stac";
import DetailListItem from "./DetailListItem";

interface AssetListProps {
  item: IStacItem;
}

const AssetList = ({ item }: AssetListProps) => {
  return (
    <PivotItem headerText="Assets">
      <MessageBar styles={{ root: { margin: "10px 0" } }}>
        These file assets are accessible via the
        <NewTabLink href="/docs/quickstarts/reading-stac/">
          Planetary Computer STAC API
        </NewTabLink>
      </MessageBar>
      {item.assets &&
        Object.entries(item.assets).map(([key, asset]) => {
          const role = asset?.roles?.[0];
          const roleLabel = role ? role + ": " : "";

          const type = mediaTypeOverride(asset.type);

          return (
            <DetailListItem
              key={key}
              label={asset.title}
              value={
                <>
                  <Text block>
                    <code>{`${roleLabel}${type}`}</code>
                  </Text>
                  <Text>{asset.description}</Text>
                </>
              }
            />
          );
        })}
    </PivotItem>
  );
};

export default AssetList;
