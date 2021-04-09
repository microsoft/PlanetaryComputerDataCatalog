import React from "react";
import { Text } from "@fluentui/react";
import NewTabLink from "../controls/NewTabLink";
import LabeledValue from "../controls/LabeledValue";

const License = ({ collection }) => {
  const { license, links } = collection;
  const licenseLink = links.find(l => l.rel === "license");
  const defaultText = license || "None provided";

  // Figure out the best license text from the link title, the license
  // attribute, or the default text. Capitalize.
  const licenseText = (licenseLink?.title || defaultText).replace(/\w\S*/g, w =>
    w.replace(/^\w/, c => c.toUpperCase())
  );

  const formattedLicense =
    license && licenseLink ? (
      <NewTabLink href={licenseLink.href}>{licenseText}</NewTabLink>
    ) : (
      <Text>{licenseText}</Text>
    );

  return <LabeledValue label="License">{formattedLicense}</LabeledValue>;
};

export default License;
