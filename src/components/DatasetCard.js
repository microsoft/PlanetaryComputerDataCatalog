import React from "react";
import { Link, Text } from "@fluentui/react";

// Similar to a STAC collection card, but for configured "other" dataset types
const DatasetCard = ({ dataset }) => {
  return (
    <div className="ds-item" style={{ width: 200 }} key={dataset.title}>
      <img
        alt={dataset.alt}
        src={dataset.thumbnailUrl}
        style={{ minHeight: 112 }}
      />
      <h3>{dataset.title}</h3>
      <Text block styles={{ root: { marginBottom: 5 } }}>
        {dataset.description}
      </Text>
      {dataset.sourceUrl && (
        <>
          <Link href={dataset.sourceUrl}>Source</Link> |{" "}
        </>
      )}
      <Link href={dataset.infoUrl}>Explore {dataset.title}</Link>
    </div>
  );
};

export default DatasetCard;
