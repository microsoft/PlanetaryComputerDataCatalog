import React from "react";
import { Link, Text } from "@fluentui/react";
import { Link as RouterLink } from "react-router-dom";
import { FontIcon } from "@fluentui/react/lib/Icon";
import { mergeStyles } from "@fluentui/react/lib/Styling";

const iconClass = mergeStyles({
  fontSize: 50,
  height: 50,
  width: "100%",
  textAlign: "center",
  marginBottom: 25,
  color: "#0078d4",
});

const Resource = ({ title, to, href, children }) => {
  const content = (
    <>
      <FontIcon aria-label={title} iconName="CompassNW" className={iconClass} />
      <Text
        block
        variant="large"
        className="item-header"
        style={{ fontWeight: 700, marginBottom: ".5rem", textAlign: "center" }}
      >
        {title}
      </Text>
      <Text block style={{ textAlign: "center" }}>
        {children}
      </Text>
    </>
  );
  const link = href ? (
    <Link href={href}>{content}</Link>
  ) : (
    <RouterLink to={to}>{content}</RouterLink>
  );
  return <div className="home-resource-item">{link}</div>;
};

export default Resource;
