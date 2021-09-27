import { PrimaryButton } from "@fluentui/react";
import centroid from "@turf/centroid";
import * as qs from "query-string";

import { IStacCollection } from "types/stac";
import { isValidExplorer, spatialExtentToMultipolygon } from "utils/collections";

interface LaunchInExplorerProps {
  collection: IStacCollection;
}

const LaunchInExplorer = ({ collection }: LaunchInExplorerProps) => {
  if (!isValidExplorer(collection)) return null;

  const bbox = collection?.extent.spatial.bbox;
  const extentPoly = spatialExtentToMultipolygon(bbox);
  const center = extentPoly ? centroid(extentPoly) : undefined;

  const params = {
    c: center?.geometry.coordinates.map(n => n.toFixed(4)).join(","),
    d: collection?.id,
  };

  return (
    <PrimaryButton
      styles={{ root: {} }}
      href={`/explore?${qs.stringify(params)}`}
      title="Search and visualize this dataset in Explorer"
    >
      Launch in Explorer
    </PrimaryButton>
  );
};

export default LaunchInExplorer;
