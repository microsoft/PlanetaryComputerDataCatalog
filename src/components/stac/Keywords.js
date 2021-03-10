import React from "react";
import { Text } from "@fluentui/react";

const pillStyle = {
  root: {
    borderRadius: "4px",
    border: "1px solid #ccc",
    padding: "3px",
    margin: "3px",
  },
};

const Keywords = ({ keywords = [] }) => {
  const sections = keywords.map(keyword => {
    return (
      <Text key={`kw-${keyword}`} styles={pillStyle}>
        {keyword}
      </Text>
    );
  });

  return <section style={{ marginBottom: "5px" }}>{sections}</section>;
};

export default Keywords;
