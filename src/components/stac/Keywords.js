import React from "react";
import { Text } from "@fluentui/react";
import { tagCase } from "../../utils";

const Keywords = ({ keywords = [], onClick = () => {}, color = "#fff" }) => {
  const sections = keywords.map(keyword => {
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
        textAlign: "center",
      },
    };

    const formatted = tagCase(keyword);
    return (
      <Text
        as="button"
        title={`Filter datasets by "${formatted}"`}
        key={`kw-${keyword}`}
        styles={pillStyle}
        onClick={() => onClick(keyword)}
      >
        {formatted}
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
