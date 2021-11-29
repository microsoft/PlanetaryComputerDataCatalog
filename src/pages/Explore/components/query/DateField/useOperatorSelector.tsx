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

  const [operatorSelection, setOperatorSelection] = useState<IContextualMenuItem>(
    opItemFromExpression(dateExpression, menuItems)
  );

  const resetOperatorSelection = () => {
    setOperatorSelection(opItemFromExpression(dateExpression, menuItems));
  };

  const menu: IContextualMenuProps = {
    items: menuItems,
    onItemClick: handleOperatorChange,
  };

  const OperatorSelector = (
    <CommandButton
      text={operatorSelection.text}
      menuProps={menu}
      styles={opDropdownStyles}
    />
  );

  return { OperatorSelector, operatorSelection, resetOperatorSelection };
};

export default useOperatorSelector;

const menuItems: IContextualMenuProps["items"] = [
  { key: "between", text: "Between dates" },
  { key: "on", text: "On date" },
  { key: "before", text: "On or before date" },
  { key: "after", text: "On or after date" },
];

const opItemFromExpression = (
  dateExpression: CqlDate,
  menuItems: IContextualMenuProps["items"]
): IContextualMenuItem => {
  const item = menuItems.find(item => {
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
  },
  label: {
    margin: 0,
    color: theme.palette.themePrimary,
  },
  menuIcon: {
    color: theme.palette.themePrimary,
  },
};
