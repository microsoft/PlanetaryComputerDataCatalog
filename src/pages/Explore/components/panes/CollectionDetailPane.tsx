import { Separator } from "@fluentui/react";
import NewTabLink from "components/controls/NewTabLink";
import { useContext } from "react";

import { ExploreContext } from "../state";

const CollectionDetailPane = () => {
  const {
    state: { collection },
  } = useContext(ExploreContext);
  if (!collection) return null;

  return (
    <>
      <Separator />
      <h4>{collection?.title}</h4>
      <p>
        {collection?.["msft:short_description"]}{" "}
        <NewTabLink href={`/dataset/${collection.id}`}>Read more...</NewTabLink>
      </p>
      <Separator />
    </>
  );
};

export default CollectionDetailPane;
