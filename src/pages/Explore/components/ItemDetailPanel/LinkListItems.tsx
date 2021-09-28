import NewTabLink from "components/controls/NewTabLink";
import { IStacItem } from "types/stac";
import DetailListItem from "./DetailListItem";

interface LinkListItemsProps {
  item: IStacItem;
}

const LinkListItems = ({ item }: LinkListItemsProps) => {
  const selfLink = item.links?.find(link => link.rel === "self");
  const parentLink = item.links?.find(link => link.rel === "parent");

  const selfLinkItem = selfLink ? (
    <DetailListItem
      key="link-self"
      label="STAC Item"
      value={<NewTabLink href={selfLink.href}>{item.id}</NewTabLink>}
    />
  ) : null;
  const parentLinkItem = parentLink ? (
    <DetailListItem
      key="link-parent"
      label="STAC Collection"
      value={<NewTabLink href={parentLink.href}>{item.collection}</NewTabLink>}
    />
  ) : null;
  const links = [selfLinkItem, parentLinkItem].filter(Boolean);

  return <>{links}</>;
};

export default LinkListItems;
