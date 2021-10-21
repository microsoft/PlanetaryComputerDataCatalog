import { useState } from "react";
import {
  IContextualMenuItem,
  CommandButton,
  IContextualMenuProps,
  IButtonStyles,
} from "@fluentui/react";
import { CqlDate } from "../../../utils/cql/types";

const useOperatorSelector = (dateExpression: CqlDate) => {
  const handleOperatorChange = (_: any, item: IContextualMenuItem | undefined) => {
    item && setCurrentOp(item);
  };

  const menuItems = getMenuItems(handleOperatorChange);

  const [currentOp, setCurrentOp] = useState<IContextualMenuItem>(
    opItemFromExpression(dateExpression, menuItems)
  );
  const OperatorSelector = (
    <CommandButton
      text={currentOp.text}
      menuProps={menuItems}
      styles={opDropdownStyles}
    />
  );

  return { OperatorSelector, currentOp };
};

export default useOperatorSelector;

const getMenuItems = (
  handleClick: (_: any, item: IContextualMenuItem | undefined) => void
): IContextualMenuProps => {
  return {
    items: [
      { key: "eq", text: "On date", onClick: handleClick },
      { key: "gte", text: "On or after date", onClick: handleClick },
      { key: "lte", text: "On or before date", onClick: handleClick },
      { key: "anyinteracts", text: "Between dates", onClick: handleClick },
    ],
  };
};

const opItemFromExpression = (
  dateExpression: CqlDate,
  menuItems: IContextualMenuProps
): IContextualMenuItem => {
  const item = menuItems.items.find(item => item.key === dateExpression.operator);

  if (!item) {
    throw new Error(
      `Unable to find operator "${dateExpression.operator}" for date control`
    );
  }

  return item;
};

const opDropdownStyles: IButtonStyles = {
  root: {
    padding: 0,
  },
  label: {
    margin: 0,
  },
};
