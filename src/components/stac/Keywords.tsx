import { ITextStyles, Text } from "@fluentui/react";
import { tagCase } from "utils";

interface IKeywordsProp {
  keywords: string[];
  onClick?: (keyword: string) => void;
  color: string;
  dark: boolean;
}

const Keywords = ({
  keywords = [],
  onClick = _ => {},
  color = "#fff",
  dark = false,
}: IKeywordsProp) => {
  const sections = keywords.map(keyword => {
    const pillStyle: ITextStyles = {
      root: {
        backgroundColor: dark ? "rgba(0,0,0,0.05)" : "transparent",
        borderRadius: "4px",
        border: `0.5px solid ${color}`,
        padding: "6px",
        margin: "5px",
        minWidth: "30px",
        display: "inline-block",
        color: color,
        fontWeight: dark ? 500 : 400,
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
        onClick={() => onClick(keyword.toLowerCase())}
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
