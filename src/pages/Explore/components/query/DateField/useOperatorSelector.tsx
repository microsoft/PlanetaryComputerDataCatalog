import { useState } from "react";
import {
  IContextualMenuItem,
  CommandButton,
  IContextualMenuProps,
  IButtonStyles,
  getTheme,
} from "@fluentui/react";
import { CqlDate } from "pages/Explore/utils/cql/types";

const useOperatorSelector = (dateExpression: CqlDate) => {
  const handleOperatorChange = (_: any, item: IContextualMenuItem | undefined) => {
    item && setOperatorSelection(item);
  };

  const menuItems = getMenuItems(handleOperatorChange);

  const [operatorSelection, setOperatorSelection] = useState<IContextualMenuItem>(
    opItemFromExpression(dateExpression, menuItems)
  );

  const resetOperatorSelection = () => {
    setOperatorSelection(opItemFromExpression(dateExpression, menuItems));
  };

  const OperatorSelector = (
    <CommandButton
      text={operatorSelection.text}
      menuProps={menuItems}
      styles={opDropdownStyles}
    />
  );

  return { OperatorSelector, operatorSelection, resetOperatorSelection };
};

export default useOperatorSelector;

const getMenuItems = (
  handleClick: (_: any, item: IContextualMenuItem | undefined) => void
): IContextualMenuProps => {
  return {
    items: [
      { key: "on", text: "On date", onClick: handleClick },
      { key: "before", text: "On or before date", onClick: handleClick },
      { key: "after", text: "On or after date", onClick: handleClick },
      { key: "between", text: "Between dates", onClick: handleClick },
    ],
  };
};

const opItemFromExpression = (
  dateExpression: CqlDate,
  menuItems: IContextualMenuProps
): IContextualMenuItem => {
  const item = menuItems.items.find(item => {
    // Range will be anyinteracts with two different days as values
    if (dateExpression.isRange) {
      return item.key === "between";
    }

    // Equals is really an anyinteracts with a single day in both values
    if (
      dateExpression.operator === "anyinteracts" ||
      dateExpression.operator === "eq"
    ) {
      return item.key === "on";
    }

    if (dateExpression.operator === "lte") {
      return item.key === "before";
    }

    if (dateExpression.operator === "gte") {
      return item.key === "after";
    }

    return false;
  });

  if (!item) {
    throw new Error(
      `Unable to find operator "${dateExpression.operator}" for date control`
    );
  }

  return item;
};

const theme = getTheme();
const opDropdownStyles: IButtonStyles = {
  root: {
    padding: 0,
    paddingBottom: 10,
    height: "auto",
  },
  label: {
    margin: 0,
    color: theme.palette.themeSecondary,
  },
};
