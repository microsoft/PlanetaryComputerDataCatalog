import React from "react";
import { Text } from "@fluentui/react";

const Keywords = ({ keywords = [] }) => {
  const sections = keywords.map(keyword => {
    const transform = keyword.length > 4 ? "capitalize" : "uppercase";
    const pillStyle = {
      root: {
        borderRadius: "4px",
        border: "0.5px solid #fff",
        padding: "6px",
        margin: "5px",
        minWidth: "30px",
        display: "inline-block",
        color: "#fff",
        textTransform: transform,
        textAlign: "center",
      },
    };

    return (
      <Text key={`kw-${keyword}`} styles={pillStyle}>
        {keyword}
      </Text>
    );
  });

  return <section style={{ marginBottom: "5px" }}>{sections}</section>;
};

export default Keywords;
