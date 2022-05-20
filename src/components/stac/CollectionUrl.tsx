import NewTabLink from "../controls/NewTabLink";
import LabeledValue from "../controls/LabeledValue";
import { useStac } from "./CollectionContext";

const CollectionUrl = () => {
  const collection = useStac();

  if (!collection) return null;
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
