import React from "react";
import { FontIcon, Text } from "@fluentui/react";
import { mergeStyles } from "@fluentui/react/lib/Styling";

import NewTabLink from "../controls/NewTabLink";

const iconClass = mergeStyles({
  fontSize: 12,
  margin: 5,
  position: "absolute",
});

const ChevronLink = ({ href, label }) => {
  return (
    <Text block variant="medium" style={{ fontWeight: 600 }}>
      <NewTabLink href={href}>
        {label}
        <FontIcon iconName="ChevronRightSmall" className={iconClass} />
      </NewTabLink>
    </Text>
  );
};

export default ChevronLink;
