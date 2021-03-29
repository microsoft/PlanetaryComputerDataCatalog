import { Text } from "@fluentui/react";
import React from "react";

const Section = ({ title, color = "#f0f0f0", children }) => {
  return (
    <div
      style={{
        display: "flex",
        minHeight: 175,
        background: color,
        padding: "20px 5%",
      }}
    >
      <div>
        <Text block variant="xLargePlus" styles={{ root: { width: 200 } }}>
          {title}
        </Text>
      </div>
      <div>
        <Text block>{children}</Text>
      </div>
    </div>
  );
};

export default Section;
