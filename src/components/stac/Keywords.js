import React from "react";
import { Text } from "@fluentui/react";

const pillStyle = {
  root: {
    borderRadius: "4px",
    border: "0.5px solid #717171",
    padding: "6px",
    margin: "5px",
    minWidth: "30px",
    display: "inline-block",
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
