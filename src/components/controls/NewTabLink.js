import React from "react";
import { Link } from "@fluentui/react";

const NewTabLink = ({ href, children }) => {
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </Link>
  );
};

export default NewTabLink;
