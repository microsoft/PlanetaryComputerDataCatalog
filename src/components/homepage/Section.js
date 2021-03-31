import { Text } from "@fluentui/react";
import React from "react";

const Section = ({ title, color = "#258EDE", children }) => {
  return (
    <div
      style={{
        display: "flex",
        minHeight: 300,
        background: color,
        padding: "20px 10%",
        alignItems: "center",
      }}
    >
      <div style={{ width: "49%" }}>
        <Text block variant="xxLargePlus" styles={{ root: { color: "#fff" } }}>
          {title}
        </Text>
      </div>
      <div style={{ width: "49%" }}>{children}</div>
    </div>
  );
};

export default Section;
