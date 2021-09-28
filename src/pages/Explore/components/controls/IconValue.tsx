import { FontIcon, Stack } from "@fluentui/react";
import { mergeStyles } from "@fluentui/react/lib/Styling";

interface IconValueProps {
  iconName: string;
  title: string;
  value: string;
  iconSize?: number;
}

const IconValue = ({ iconName, title, value, iconSize = 20 }: IconValueProps) => {
  const iconClass = mergeStyles({
    fontSize: iconSize,
    height: 20,
    width: 20,
  });

  return (
    <Stack horizontal tokens={{ childrenGap: 8 }}>
      <span>{value} </span>
      <FontIcon
        title={title}
        aria-label={title}
        iconName={iconName}
        className={iconClass}
      />
    </Stack>
  );
};

export default IconValue;
