import NewTabLink from "../controls/NewTabLink";
import LabeledValue from "../controls/LabeledValue";
import { useStac } from "./CollectionContext";
import { IStacCollection } from "types/stac";

const CollectionUrl = () => {
  const collection: IStacCollection = useStac();
  const { links } = collection;
  const href = links.find(l => l.rel === "self")?.href;

  if (!href) return null;

  const link = (
    <NewTabLink href={href} title="Raw STAC Collection response">
      {href}
    </NewTabLink>
  );
  return <LabeledValue label="STAC Collection">{link}</LabeledValue>;
};

export default CollectionUrl;
