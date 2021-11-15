import { JSONSchema } from "@apidevtools/json-schema-ref-parser";
import {
  getTheme,
  FontSizes,
  CommandButton,
  IButtonStyles,
  IContextualMenuProps,
  IIconProps,
  IContextualMenuItem,
} from "@fluentui/react";
import { useExploreDispatch } from "pages/Explore/state/hooks";
import { setCustomCqlExpressions } from "pages/Explore/state/mosaicSlice";
import { CqlParser } from "pages/Explore/utils/cql";
import { makeDefaultCqlExpression } from "pages/Explore/utils/cql/helpers";

interface AddAttributeProps {
  queryable: JSONSchema | undefined;
  cql: CqlParser | null;
}

export const AddFilter = ({ queryable, cql }: AddAttributeProps) => {
  const dispatch = useExploreDispatch();
  const existingProperties = getCurrentProperties(cql);
  const items = makeMenuItems(queryable, existingProperties);
  const disabled = items.length === 0;

  const handleClick = (_: any, item: IContextualMenuItem | undefined) => {
    const cql = makeDefaultCqlExpression(
      item?.key as string,
      item?.data as JSONSchema
    );
    dispatch<any>(setCustomCqlExpressions(cql));
  };

  const menu: IContextualMenuProps = {
    isBeakVisible: true,
    items,
    onItemClick: handleClick,
  };
  const addIcon: IIconProps = { iconName: "CircleAdditionSolid" };

  return (
    <CommandButton
      styles={buttonStyles}
      iconProps={addIcon}
      menuProps={menu}
      disabled={disabled}
    >
      Add
    </CommandButton>
  );
};

const getCurrentProperties = (cql: CqlParser | null) => {
  const existing = cql?.expressions.map(exp => exp.property);
  return existing || [];
};

const makeMenuItems = (
  queryable: JSONSchema | undefined,
  existingProperties: string[]
): IContextualMenuProps["items"] => {
  const keys = Object.keys(queryable?.properties || {});
  const fields = queryable?.properties;

  return keys.map(key => {
    const field = fields?.[key] as JSONSchema;
    const exists = existingProperties.includes(key);
    const tooltip = exists
      ? "This property is currently being filtered on"
      : field.description;

    return {
      key,
      text: field.title,
      title: tooltip,
      disabled: exists,
      data: field,
    };
  });
};

const theme = getTheme();
const buttonStyles: IButtonStyles = {
  root: {
    padding: 0,
    paddingBottom: 0,
    height: "auto",
  },
  label: {
    fontSize: FontSizes.size12,
    margin: 0,
    color: theme.palette.themePrimary,
  },
  icon: {
    fontSize: FontSizes.size12,
  },
  menuIcon: { display: "none" },
};
