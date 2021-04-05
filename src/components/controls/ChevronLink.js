import React from "react";
import { FontIcon, Link, Text } from "@fluentui/react";
import { mergeStyles } from "@fluentui/react/lib/Styling";

const iconClass = mergeStyles({
  fontSize: 12,
  margin: 5,
  position: "absolute",
});

const ChevronLink = ({ href, label }) => {
  return (
    <Text block variant="medium" style={{ fontWeight: 600 }}>
      <Link href={href}>
        {label}

        <FontIcon
          aria-label={label}
          iconName="ChevronRightSmall"
          className={iconClass}
        />
      </Link>
    </Text>
  );
};

export default ChevronLink;
