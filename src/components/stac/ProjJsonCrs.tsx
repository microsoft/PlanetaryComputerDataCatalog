import {
  FontIcon,
  HoverCard,
  HoverCardType,
  IconButton,
  mergeStyles,
  mergeStyleSets,
} from "@fluentui/react";
import { useCopyToClipboard } from "react-use";
import LabeledValue from "../controls/LabeledValue";

interface IProjJsonCrs {
  crs: { conversion: { method: { name: string } } };
}

const ProjJsonCrs = ({ crs }: IProjJsonCrs) => {
  const copyToClipboard = useCopyToClipboard()[1];

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

  const plainCardProps = {
    onRenderPlainCard: (item: any) => {
      const itemStr = JSON.stringify(item, null, 2);
      return (
        <div>
          <div className={classNames.compactCard}>{item.conversion.method.name}</div>
          <div className={classNames.expandedCard}>
            <IconButton
              iconProps={{ iconName: "Copy" }}
              onClick={() => copyToClipboard(itemStr)}
              title="Copy to clipboard"
              style={{ float: "right" }}
            />
            <LabeledValue label="projJSON" />
            <div className="input_area">
              <pre>{itemStr}</pre>
            </div>
          </div>
        </div>
      );
    },
    renderData: crs,
  };

  const iconClass = mergeStyles({
    fontSize: 14,
    margin: 5,
    position: "absolute",
  });

  return (
    <HoverCard
      plainCardProps={plainCardProps}
      instantOpenOnClick={true}
      cardDismissDelay={300}
      cardOpenDelay={300}
      type={HoverCardType.plain}
    >
      <div className={classNames.item}>
        {crs.conversion.method.name}{" "}
        <FontIcon iconName="Info" className={iconClass} />
      </div>
    </HoverCard>
  );
};

export default ProjJsonCrs;
