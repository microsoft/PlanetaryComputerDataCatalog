// Control which shows a link button to toggle visibility of a panel
// displaying all raster:bands values of an asset.

import { IconButton, Panel, PanelType, Separator } from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";
import { stacFormatter } from "utils/stac";
import { ASSET_DETAIL_KEYS } from "./ItemAssets";

interface AssetDetailsProps {
  asset: Record<string, any>;
}

const AssetDetails = ({ asset }: AssetDetailsProps) => {
  const [isOpen, { setTrue, setFalse }] = useBoolean(false);

  const formattedSections = ASSET_DETAIL_KEYS.map(key => ({
    key,
    detail: asset[key],
  }))
    .filter(detail => Boolean(detail.detail))
    .map(({ key, detail }) => {
      return (
        <>
          <h3 style={{ marginBottom: 2 }}>{stacFormatter.label(key)}</h3>
          {stacFormatter.format(detail, key)}
        </>
      );
    });

  if (formattedSections.length === 0) return null;

  return (
    <>
      <IconButton
        iconProps={{ iconName: "Info" }}
        title="Show asset details"
        onClick={setTrue}
        styles={{ root: { height: 16 } }}
      />
      <Panel
        type={PanelType.custom}
        customWidth={"400px"}
        headerText={asset.title || "Asset details"}
        isOpen={isOpen}
        isLightDismiss={true}
        onDismiss={setFalse}
        closeButtonAriaLabel="Close"
      >
        <Separator />
        {formattedSections}
      </Panel>
    </>
  );
};

export default AssetDetails;
