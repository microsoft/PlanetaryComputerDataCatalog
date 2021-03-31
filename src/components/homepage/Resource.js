import React from "react";
import { Text } from "@fluentui/react";
import { FontIcon } from "@fluentui/react/lib/Icon";
import { mergeStyles } from "@fluentui/react/lib/Styling";

const iconClass = mergeStyles({
  fontSize: 50,
  height: 50,
  width: "100%",
  textAlign: "center",
  marginBottom: 25,
  color: "#258EDE",
});

const Resource = ({ title, children }) => {
  return (
    <div className="home-resource-item">
      <FontIcon aria-label={title} iconName="CompassNW" className={iconClass} />
      <Text
        block
        variant="large"
        style={{ fontWeight: 700, marginBottom: ".5rem", textAlign: "center" }}
      >
        {title}
      </Text>
      <Text block style={{ textAlign: "center" }}>
        {children}
      </Text>
    </div>
  );
};

export default Resource;
