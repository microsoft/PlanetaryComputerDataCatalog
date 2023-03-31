import { getTheme, IconButton, Separator, Stack } from "@fluentui/react";

interface ExporterHeaderProps {
  title: string;
  subTitle?: string;
  onClose: () => void;
}

export const ExporterHeader: React.FC<ExporterHeaderProps> = ({
  title,
  subTitle,
  onClose,
  children,
}) => {
  return (
    <>
      <Stack horizontal horizontalAlign="space-between">
        <h3 style={headerStyles}>{title}</h3>
        <IconButton
          title="Close"
          aria-label="Close Image export panel"
          styles={buttonStyles}
          iconProps={iconProps}
          onClick={onClose}
        />
      </Stack>
      {children}
      <Separator styles={{ root: { padding: "0 4px" } }} />
      {subTitle && <h4 style={headerStyles}>{subTitle}</h4>}
    </>
  );
};

const theme = getTheme();

const buttonStyles = {
  root: { color: theme.semanticColors.bodyText },
  rootHovered: {
    color: theme.palette.neutralDark,
  },
};
const iconProps = { iconName: "Cancel" };
const headerStyles = { marginBottom: 4 };
