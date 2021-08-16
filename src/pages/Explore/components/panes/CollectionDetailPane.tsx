import { Separator } from "@fluentui/react";

import { ViewerMode } from "../state/types";
import { useExploreSelector } from "../state/hooks";

const CollectionDetailPane = () => {
  const { mode, collection } = useExploreSelector(s => s.mosaic);

  if (!collection) return null;
  if (mode === ViewerMode.scenes) return null;

  return (
    <>
      <Separator />
      <h4>{collection?.title}</h4>
      {/* <p>
        {collection?.["msft:short_description"]}{" "}
        <NewTabLink href={`/dataset/${collection.id}`}>Read more...</NewTabLink>
      </p> */}
      <Separator />
    </>
  );
};

export default CollectionDetailPane;
