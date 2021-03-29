import React from "react";
import { Link, Text } from "@fluentui/react";

const ResourceCard = ({ resourceItem, width = 200 }) => {
  const { alt, title, thumbnailUrl, description, infoUrl } = resourceItem;

  return (
    <Link href={infoUrl} underline={false} style={{ textDecoration: "none" }}>
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
      </div>
    </Link>
  );
};

export default ResourceCard;
