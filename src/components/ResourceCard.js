import React from "react";
import { Link, Text } from "@fluentui/react";

const ResourceCard = ({ resourceItem, width = 200 }) => {
  const { alt, title, thumbnailUrl, description, infoUrl } = resourceItem;

  return (
    <div
      style={{
        flex: "0 32%",
        marginBottom: "2%",
      }}
    >
      <Link href={infoUrl} underline={false} style={{ textDecoration: "none" }}>
        <img alt={alt || `Screenshot of ${title}`} src={thumbnailUrl} />
        <h3>{title}</h3>
        <Text block>{description}</Text>
      </Link>
    </div>
  );
};

export default ResourceCard;
