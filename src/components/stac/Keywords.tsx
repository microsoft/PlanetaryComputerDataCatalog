import { ITextStyles, Text } from "@fluentui/react";

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
        backgroundColor: dark ? "transparent" : "#edebe9",
        borderRadius: "2px",
        border: dark ? "1px solid rgba(255,255,255,0.5)" : "0",
        padding: "3px 8px",
        margin: "0 8px 8px 0",
        minWidth: "30px",
        display: "inline-block",
        color: color,
        fontWeight: dark ? 500 : 400,
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
