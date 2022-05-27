import {
  ContextualMenu,
  DirectionalHint,
  IContextualMenuProps,
  IStackStyles,
  ITextStyles,
  Stack,
  Text,
} from "@fluentui/react";
import { useCallback, useRef, useState } from "react";

interface IKeywordsProp {
  keywords: string[];
  onClick?: (keyword: string) => void;
  color?: string;
  dark?: boolean;
  maxDisplayed?: number;
}

const Keywords = ({
  keywords = [],
  onClick = _ => {},
  color = "#fff",
  dark = false,
  maxDisplayed = 6,
}: IKeywordsProp) => {
  const linkRef = useRef(null);
  const [showContextualMenu, setShowContextualMenu] = useState(false);
  const onShowContextualMenu = useCallback(
    (ev: React.MouseEvent<HTMLElement>) => {
      if (showContextualMenu) {
        setShowContextualMenu(false);
      }
      setShowContextualMenu(true);
    },
    [showContextualMenu]
  );

  const onHideContextualMenu = useCallback(() => setShowContextualMenu(false), []);

  const pillStyle = getPillStyle(dark, color);
  const sections = keywords.slice(0, maxDisplayed).map(keyword => {
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

  if (keywords.length > maxDisplayed) {
    const overflowProps: IContextualMenuProps = {
      items: keywords.slice(maxDisplayed).map(keyword => ({
        key: `kw-${keyword}`,
        text: keyword,
        onClick: () => onClick(keyword),
      })),
    };

    const overflow = (
      <div ref={linkRef} key={"kw-overflow"}>
        <Text
          as="button"
          title={"Additional keywords"}
          styles={pillStyle}
          onClick={onShowContextualMenu}
        >
          ...
        </Text>
        <ContextualMenu
          items={overflowProps.items}
          hidden={!showContextualMenu}
          target={linkRef}
          onItemClick={onHideContextualMenu}
          onDismiss={onHideContextualMenu}
          directionalHint={DirectionalHint.rightTopEdge}
          isBeakVisible={false}
        />
      </div>
    );
    sections.push(overflow);
  }

  return (
    <Stack horizontal className="keywords-bar" styles={keywordBarStyles}>
      {sections}
    </Stack>
  );
};

export default Keywords;

const getPillStyle = (dark: boolean, color: string): ITextStyles => {
  return {
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
};

const keywordBarStyles: IStackStyles = {
  root: { marginBottom: 5 },
};
