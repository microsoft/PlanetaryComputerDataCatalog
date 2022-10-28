import { Separator, Text } from "@fluentui/react";
import { CSSProperties } from "react";

type INamedEntry = {
  name: string;
  description?: string;
  [key: string]: any;
};

interface NamedEntryProps {
  entry: INamedEntry;
}

const NamedEntry: React.FC<NamedEntryProps> = ({ entry }) => {
  const extraKeys = Object.keys(entry).filter(
    key => !["name", "description"].includes(key)
  );

  return (
    <div className="named-entry">
      <Separator />
      <h4 style={headerStyle}>{entry.name}</h4>
      <Text block styles={descStyles}>
        {entry.description}
      </Text>
      <ul style={listStyles}>
        {extraKeys.map(key => (
          <li key={key}>
            {key}: {entry[key]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NamedEntry;

const headerStyle: CSSProperties = {
  marginBottom: 4,
};

const descStyles = {
  root: {
    "&:first-letter": {
      textTransform: "capitalize",
    },
  },
};

const listStyles: CSSProperties = {
  margin: "7px 0",
};
