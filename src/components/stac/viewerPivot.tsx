import React, { Suspense } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link, PivotItem } from "@fluentui/react";

import { IStacCollection } from "types/stac";
const TileJsonViewer = React.lazy(
  () => import("components/controls/TileJsonViewer")
);

export const viewerPivot = (collection: IStacCollection | null) => {
  if (!collection) return null;
  const tilejsonAsset = Object.values(collection.assets).find(asset =>
    asset.roles?.includes("tiles")
  );
  if (!tilejsonAsset) return null;

  return (
    <PivotItem headerText="Data Viewer" itemKey="viewer">
      <h2>Data viewer</h2>
      <div>
        <div style={{ maxWidth: 800 }}>
          The {collection.title} dataset contains a{" "}
          <Link href="https://github.com/mapbox/tilejson-spec/tree/master/2.2.0">
            TileJSON
          </Link>{" "}
          asset that can be included in common web mapping libraries to render visual
          tiles. You can explore this dataset using the map viewer below, or use in
          your own project with the following URL (see{" "}
          <RouterLink to="/terms">terms</RouterLink>
          ):
        </div>
        <div className="input_area">
          <div className="highlight">
            <pre>{tilejsonAsset.href}</pre>
          </div>
        </div>
      </div>
      <Suspense fallback={<div />}>
        <TileJsonViewer href={tilejsonAsset.href} collectionId={collection.id} />
      </Suspense>
    </PivotItem>
  );
};
