import { Text } from "@fluentui/react";
import React from "react";

const Resource = ({ title, children }) => {
  return (
    <div style={{ flex: "0 250px", height: 200, marginBottom: "2%" }}>
      <Text
        block
        variant="large"
        styles={{ root: { fontWeight: 700, marginBottom: ".5rem" } }}
      >
        {title}
      </Text>
      <Text block>{children}</Text>
    </div>
  );
};

export default Resource;
