import { FontSizes, FontWeights, ITextStyles, Text } from "@fluentui/react";

export const DateMessage: React.FC = ({ children }) => {
  return <Text styles={dateStyles}>{children}</Text>;
};

export const Message: React.FC = ({ children }) => {
  return <Text styles={styles}>{children}</Text>;
};

const styles: ITextStyles = {
  root: {
    fontSize: FontSizes.size12,
    fontWeight: FontWeights.semilight,
  },
};

const dateStyles: ITextStyles = {
  root: {
    fontSize: FontSizes.size12,
    fontWeight: 400,
  },
};
