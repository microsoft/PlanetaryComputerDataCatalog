import React from "react";
import { Link, Text } from "@fluentui/react";

const ResourceCard = ({
  resourceItem,
  sourceLabel = "Source",
  infoLabel = "Explore ",
  width = 200,
}) => {
  const {
    alt,
    title,
    thumbnailUrl,
    description,
    sourceUrl,
    infoUrl,
  } = resourceItem;

  return (
    <div className="ds-item" style={{ width: width }}>
      <img
        alt={alt || `Screenshot of ${title}`}
        src={thumbnailUrl}
        style={{ minHeight: 112 }}
      />
      <h3>{title}</h3>
      <Text block styles={{ root: { marginBottom: 5 } }}>
        {description}
      </Text>
      {sourceUrl && <Link href={sourceUrl}>{sourceLabel}</Link>}
      {sourceUrl && infoUrl && <Text> | </Text>}
      {infoUrl && <Link href={infoUrl}>{`${infoLabel} ${title}`}</Link>}
    </div>
  );
};

export default ResourceCard;
