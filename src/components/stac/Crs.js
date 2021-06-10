import {
  FontIcon,
  HoverCard,
  HoverCardType,
  IconButton,
  mergeStyles,
  mergeStyleSets,
} from "@fluentui/react";
import React from "react";
import { useCopyToClipboard } from "react-use";

import LabeledValue from "../controls/LabeledValue";
import { useStac } from "./CollectionContext";

const Crs = () => {
  const collection = useStac();
  const copyToClipboard = useCopyToClipboard()[1];

  // CRS information could be in many different places
  // First attempt is with cube extension dimensions
  const cube = collection["cube:dimensions"];
  const crs = cube
    ? Object.values(cube)
        .filter(dimension => {
          return dimension.type === "spatial";
        })
        .map(({ reference_system }) => reference_system)
        .pop()
    : null;

  if (!crs?.conversion?.method?.name) return null;

  const iconClass = mergeStyles({
    fontSize: 14,
    margin: 5,
    position: "absolute",
  });

  const classNames = mergeStyleSets({
    compactCard: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      padding: "16px 24px",
      fontWeight: "bold",
    },
    expandedCard: {
      padding: "16px 24px",
      width: 500,
    },
    item: {
      selectors: {
        "&:hover": {
          textDecoration: "underline",
          cursor: "pointer",
        },
      },
    },
  });

  const expandingCardProps = {
    onRenderPlainCard: item => {
      const itemStr = JSON.stringify(item, null, 2);
      return (
        <div>
          <div className={classNames.compactCard}>
            {item.conversion.method.name}
          </div>
          <div className={classNames.expandedCard}>
            <IconButton
              iconProps={{ iconName: "Copy" }}
              onClick={() => copyToClipboard(itemStr)}
              title="Copy to clipboard"
              style={{ float: "right" }}
            />
            <LabeledValue label="projJSON:" />
            <div className="input_area">
              <pre>{itemStr}</pre>
            </div>
          </div>
        </div>
      );
    },
    renderData: crs,
  };

  return (
    <LabeledValue label="CRS">
      <HoverCard
        plainCardProps={expandingCardProps}
        instantOpenOnClick={true}
        cardDismissDelay={300}
        cardOpenDelay={0}
        expandedCardOpenDelay={100}
        type={HoverCardType.plain}
      >
        <div className={classNames.item}>
          {crs.conversion.method.name}{" "}
          <FontIcon iconName="Info" className={iconClass} />
        </div>
      </HoverCard>
    </LabeledValue>
  );
};

export default Crs;
