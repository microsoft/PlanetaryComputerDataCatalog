import React from "react";
import { Text } from "@fluentui/react";
import ChevronLink from "./controls/ChevronLink";

const ApplicationCard = ({ app }) => {
  const { title, thumbnailUrl, description, links } = app;

  return (
    <div className="api-datasource-item">
      <h2 style={{ color: "initial" }}>{title}</h2>
      <img
        alt=""
        src={thumbnailUrl}
        style={{ maxWidth: "100%", objectFit: "contain" }}
      />
      <p style={{ marginBottom: 10, minHeight: 37 }}>{description}</p>
      <Text block variant="medium" style={{ fontWeight: 600 }}>
        {links.map(({ title, url }) => {
          return (
            <div key={title} style={{ paddingBottom: 15 }}>
              <ChevronLink href={url} label={title} />
            </div>
          );
        })}
      </Text>
    </div>
  );
};

export default ApplicationCard;
