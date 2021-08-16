import { Separator } from "@fluentui/react";
import { useContext } from "react";

import { ExploreContext } from "../state";
import { ViewerMode } from "../state/reducers";

const CollectionDetailPane = () => {
  const {
    state: { mode, collection },
  } = useContext(ExploreContext);

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
