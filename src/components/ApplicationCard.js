import React from "react";
import { Link, Text } from "@fluentui/react";
import { FontIcon } from "@fluentui/react/lib/Icon";
import { mergeStyles } from "@fluentui/react/lib/Styling";

const iconClass = mergeStyles({
  fontSize: 12,
  marginTop: 3,
});

const ApplicationCard = ({ app }) => {
  const { title, thumbnailUrl, description, links } = app;

  return (
    <div className="api-datasource-item">
      <img
        alt=""
        src={thumbnailUrl}
        style={{ maxWidth: "100%", objectFit: "contain" }}
      />
      <h3 style={{ marginBottom: 2, color: "initial" }}>{title}</h3>
      <p style={{ marginBottom: 10, minHeight: 37 }}>{description}</p>
      <Text block variant="medium" style={{ fontWeight: 600 }}>
        {links.map(({ title, url }) => {
          return (
            <div key={title} style={{ paddingBottom: 15 }}>
              <Link href={url}>
                {title}
                <FontIcon
                  aria-label={title}
                  iconName="ChevronRightSmall"
                  className={iconClass}
                />
              </Link>
            </div>
          );
        })}
      </Text>
    </div>
  );
};

export default ApplicationCard;
