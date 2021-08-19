import { Separator } from "@fluentui/react";

import { useExploreSelector } from "../state/hooks";

const CollectionDetailPane = () => {
  const { collection } = useExploreSelector(s => s.mosaic);

  if (!collection) return null;

  return (
    <>
      <Separator />
      <h4>{collection?.title}</h4>
      {/* <p>
        {collection?.["msft:short_description"]}{" "}
        <NewTabLink href={`/dataset/${collection.id}`}>Read more...</NewTabLink>
      </p> */}
    </>
  );
};

export default CollectionDetailPane;
