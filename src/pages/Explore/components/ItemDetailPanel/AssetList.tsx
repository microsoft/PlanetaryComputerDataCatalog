import {
  MessageBar,
  PivotItem,
  Text,
  getTheme,
  Stack,
  StackItem,
} from "@fluentui/react";
import NewTabLink from "components/controls/NewTabLink";
import { IStacItem } from "types/stac";
import { mediaTypeOverride } from "utils/stac";
import DetailListItem from "./DetailListItem";

interface AssetListProps {
  item: IStacItem;
}

const AssetList = ({ item }: AssetListProps) => {
  const theme = getTheme();
  const assetItems = Object.entries(item.assets).map(([key, asset]) => {
    const role = asset?.roles?.[0];
    const type = mediaTypeOverride(asset.type);

    return (
      <DetailListItem
        key={key}
        label={asset.title}
        value={
          <Stack tokens={{ childrenGap: 3 }}>
            <StackItem>
              <Text styles={{ root: { paddingRight: 4 } }}>{type}</Text>
              {role && (
                <Text
                  styles={{
                    root: {
                      backgroundColor: theme.palette.neutralLighter,
                      padding: "2px 4px",
                      borderRadius: theme.effects.roundedCorner6,
                    },
                  }}
                >
                  <code>{role}</code>
                </Text>
              )}
            </StackItem>
            <Text block style={{ fontStyle: "italic" }}>
              {asset.description}
            </Text>
            <StackItem>
              <Text
                styles={{
                  root: { paddingRight: 4 },
                }}
              >
                STAC Key:
              </Text>
              <code>{key}</code>
            </StackItem>
          </Stack>
        }
      />
    );
  });

  return (
    <PivotItem headerText="Assets">
      <MessageBar styles={{ root: { margin: "10px 0" } }}>
        These file assets are accessible via the
        <NewTabLink href="/docs/quickstarts/reading-stac/">
          Planetary Computer API
        </NewTabLink>
      </MessageBar>
      {item.assets && assetItems}
    </PivotItem>
  );
};

export default AssetList;
