import { PrimaryButton, Stack } from "@fluentui/react";
import centroid from "@turf/centroid";
import * as qs from "query-string";

import { IStacCollection } from "types/stac";
import { useCollectionMapInfo } from "utils/requests";
import { isValidExplorer, spatialExtentToMultipolygon } from "utils/collections";

interface LaunchInExplorerProps {
  collection: IStacCollection;
}

const LaunchInExplorer = ({ collection }: LaunchInExplorerProps) => {
  const { data: mapData } = useCollectionMapInfo(collection.id);
  if (!isValidExplorer(collection)) return null;

  const bbox = collection?.extent.spatial.bbox;
  const extentPoly = spatialExtentToMultipolygon(bbox);
  const centerPoint = extentPoly ? centroid(extentPoly) : undefined;

  const collectionCenterCoords = centerPoint?.geometry.coordinates
    .map(n => n.toFixed(4))
    .join(",");
  const center = mapData && [...mapData?.info.initialCoords].reverse().join(",");
  const zoom = mapData?.info.initialZoom || undefined;

  const params = {
    c: mapData?.info ? center : collectionCenterCoords,
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
