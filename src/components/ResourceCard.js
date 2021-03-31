import React from "react";
import { Link, Text } from "@fluentui/react";

const ResourceCard = ({ resourceItem, width = 200 }) => {
  const { alt, title, thumbnailUrl, description, infoUrl } = resourceItem;

  return (
    <div
      className="add-datasource-item"
      // style={{
      //   // marginBottom: "2%",
      //   height: "100%",
      //   width: "250px",
      //   border: "1px solid gray",
      //   display: "flex",
      //   flexWrap: "wrap",
      //   objectFit: "contain",
      // }}
    >
      <Link href={infoUrl} underline={false} style={{ textDecoration: "none" }}>
        <img
          alt={alt || `Screenshot of ${title}`}
          src={thumbnailUrl}
          style={{ maxWidth: "100%", objectFit: "contain" }}
        />
        <h3>{title}</h3>
        <Text block>{description}</Text>
      </Link>
    </div>
  );
};

export default ResourceCard;
