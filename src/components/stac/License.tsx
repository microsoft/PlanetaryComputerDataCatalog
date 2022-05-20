import React from "react";
import { Stack, StackItem, Text } from "@fluentui/react";

import NewTabLink from "../controls/NewTabLink";
import LabeledValue from "../controls/LabeledValue";
import { useStac } from "./CollectionContext";

const License = () => {
  const collection = useStac();
  if (!collection) return null;

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

  const citeLinks = links.filter(l => l.rel === "cite-as");
  const dois = citeLinks.length ? (
    <LabeledValue label="DOI">
      <Stack>
        {citeLinks.map((cl, idx) => {
          const doi = collection.summaries?.["sci:doi"]?.[idx];
          const doiFormatted = doi ? `: (${doi})` : "";
          const doiTitle = cl.title ? `${cl.title} ${doiFormatted}` : cl.href;
          return (
            <StackItem key={`cite-as-${idx}`}>
              <NewTabLink href={cl.href}>{doiTitle}</NewTabLink>
            </StackItem>
          );
        })}
      </Stack>
    </LabeledValue>
  ) : null;

  return (
    <Stack>
      <LabeledValue label="License">{formattedLicense}</LabeledValue>
      {dois}
    </Stack>
  );
};

export default License;
