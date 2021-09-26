import { Stack, Text, FontWeights, Icon, getTheme } from "@fluentui/react";
interface SectionProps {
  title: string;
  icon: string;
}

const Section: React.FC<SectionProps> = ({ title, icon, children }) => {
  const theme = getTheme();

  return (
    <Stack>
      <Stack horizontal tokens={{ childrenGap: 6 }} verticalAlign="center">
        <Icon
          iconName={icon}
          styles={{ root: { color: theme.palette.themePrimary } }}
        />
        <Text styles={{ root: { fontWeight: FontWeights.bold, marginBottom: 2 } }}>
          {title}
        </Text>
      </Stack>
      <Stack styles={{ root: { marginLeft: 20 } }}>{children}</Stack>
    </Stack>
  );
};

export default Section;
