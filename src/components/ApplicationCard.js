import React from "react";
import { Link, Text } from "@fluentui/react";
import ChevronLink from "./controls/ChevronLink";

const ApplicationCard = ({ app }) => {
  const { title, thumbnailUrl, description, links } = app;

  return (
    <div className="api-datasource-item">
      <h2 style={{ color: "initial" }}>{title}</h2>
      <Link
        href={links[0].url}
        underline={false}
        style={{ textDecoration: "none" }}
      >
        <div className="responsive-container-wide">
          <img alt="" src={thumbnailUrl} />
        </div>
        <p style={{ color: "initial", marginBottom: 10, minHeight: 37 }}>
          {description}
        </p>
      </Link>
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
