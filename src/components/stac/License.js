import React from "react";
import { Text } from "@fluentui/react";
import NewTabLink from "../controls/NewTabLink";
import { boldStyle } from "../../styles";

const License = ({ collection }) => {
  const { license, links } = collection;
  const licenseLink = links.find(l => l.rel === "license");
  const defaultText = "None provided";

  const formattedLicense =
    license && licenseLink ? (
      <NewTabLink href={licenseLink.href}>{license}</NewTabLink>
    ) : (
      <Text>{license || defaultText}</Text>
    );

  return (
    <div>
      <Text styles={boldStyle}>License: </Text>
      {formattedLicense}
    </div>
  );
};

export default License;
