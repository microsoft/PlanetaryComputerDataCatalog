import { PrimaryButton, Stack } from "@fluentui/react";
import centroid from "@turf/centroid";
import * as qs from "query-string";

import { IStacCollection } from "types/stac";
import { useCollectionMosaicInfo } from "pages/Explore/utils/hooks";
import { isValidExplorer, spatialExtentToMultipolygon } from "utils/collections";

interface LaunchInExplorerProps {
  collection: IStacCollection;
}

const LaunchInExplorer = ({ collection }: LaunchInExplorerProps) => {
  const { data: mapData } = useCollectionMosaicInfo(collection.id);
  if (!isValidExplorer(collection)) return null;

  const bbox = collection?.extent.spatial.bbox;
  const extentPoly = spatialExtentToMultipolygon(bbox);
  const centerPoint = extentPoly ? centroid(extentPoly) : undefined;

  const collectionCenterCoords = centerPoint?.geometry.coordinates
    .map(n => n.toFixed(4))
    .join(",");
  const defaultLocation = mapData?.defaultLocation;
  const center =
    defaultLocation?.coordinates &&
    [...defaultLocation.coordinates].reverse().join(",");
  const zoom = defaultLocation?.zoom || undefined;

  const params = {
    c: center || collectionCenterCoords,
    d: collection?.id,
    z: zoom,
  };

  return (
    <Stack styles={{ root: { paddingTop: 8 } }}>
      <PrimaryButton
        href={`/explore?${qs.stringify(params)}`}
        title="Search and visualize this dataset in Explorer"
      >
        Launch in Explorer
      </PrimaryButton>
    </Stack>
  );
};

export default LaunchInExplorer;
