import React from "react";
import { Link, Text } from "@fluentui/react";
import { FontIcon } from "@fluentui/react/lib/Icon";
import { mergeStyles } from "@fluentui/react/lib/Styling";

const iconClass = mergeStyles({
  fontSize: 12,
  marginTop: 3,
});

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
      <Text block variant="medium" style={{ fontWeight: 600 }}>
        <Link href={infoUrl}>
          {`Get ${linkLabel} data `}
          <FontIcon
            aria-label={linkLabel}
            iconName="ChevronRightSmall"
            className={iconClass}
          />
        </Link>
      </Text>
    </div>
  );
};

export default ResourceCard;
