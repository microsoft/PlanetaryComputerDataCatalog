import React from "react";
import { Link } from "@fluentui/react";

const NewTabLink = ({
  href,
  ariaLabel = "Link will open in new tab",
  children,
  As = Link,
}) => {
  return (
    <As
      href={href}
      aria-label={ariaLabel}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </As>
  );
};

export default NewTabLink;
