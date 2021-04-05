import React from "react";
import { Link, Text } from "@fluentui/react";
import ChevronLink from "./controls/ChevronLink";

const ResourceCard = ({ resourceItem }) => {
  const {
    alt,
    title,
    shortTerm,
    thumbnailUrl,
    description,
    infoUrl,
  } = resourceItem;

  const linkLabel = shortTerm || title;
  return (
    <div className="add-datasource-item">
      <Link href={infoUrl} underline={false} style={{ textDecoration: "none" }}>
        <img
          alt={alt || `Screenshot of ${title}`}
          src={thumbnailUrl}
          style={{ maxWidth: "100%", objectFit: "contain" }}
        />
        <h3 style={{ marginBottom: 2, color: "initial" }}>{title}</h3>
        <Text
          block
          variant="medium"
          style={{ marginBottom: 10, minHeight: 37 }}
        >
          {description}
        </Text>
      </Link>
      <ChevronLink href={infoUrl} label={`Get ${linkLabel} data `} />
    </div>
  );
};

export default ResourceCard;
