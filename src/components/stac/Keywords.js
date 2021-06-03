import React from "react";
import { Text } from "@fluentui/react";

const Keywords = ({ keywords = [], onClick = () => {}, color = "#fff" }) => {
  const sections = keywords.map(keyword => {
    const transform = keyword.length > 4 ? "capitalize" : "uppercase";
    const pillStyle = {
      root: {
        backgroundColor: "transparent",
        borderRadius: "4px",
        border: `0.5px solid ${color}`,
        padding: "6px",
        margin: "5px",
        minWidth: "30px",
        display: "inline-block",
        color: color,
        textTransform: transform,
        textAlign: "center",
      },
    };

    return (
      <Text
        as="button"
        title={`Filter datasets by "${keyword}"`}
        key={`kw-${keyword}`}
        styles={pillStyle}
        onClick={() => onClick(keyword)}
      >
        {keyword}
      </Text>
    );
  });

  return (
    <div className="keywords-bar" style={{ marginBottom: "5px" }}>
      {sections}
    </div>
  );
};

export default Keywords;
