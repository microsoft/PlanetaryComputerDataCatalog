import { JSONSchema } from "@apidevtools/json-schema-ref-parser";
import {
  getTheme,
  IDropdownOption,
  Dropdown,
  IDropdownStyles,
  ITextStyles,
  FontSizes,
  IIconStyles,
} from "@fluentui/react";
import { useExploreDispatch } from "pages/Explore/state/hooks";
import {
  removeCustomCqlExpression,
  setCustomCqlExpressions,
} from "pages/Explore/state/mosaicSlice";
import { CqlParser } from "pages/Explore/utils/cql";
import { makeDefaultCqlExpression } from "pages/Explore/utils/cql/helpers";
import { renderPlaceholder } from "pages/Explore/utils/dropdownRenderers";

interface AddAttributeProps {
  queryable: JSONSchema | undefined;
  cql: CqlParser | null;
}

export const AddFilter = ({ queryable, cql }: AddAttributeProps) => {
  const dispatch = useExploreDispatch();
  const existingProperties = getCurrentProperties(cql);
  const options = makeDropdownItems(queryable, existingProperties);

  const handleChange = (_: any, item: IDropdownOption | undefined) => {
    const property = item?.key as string;
    const field = item?.data as JSONSchema;

    if (item?.selected) {
      const cql = makeDefaultCqlExpression(property, field);
      dispatch(setCustomCqlExpressions(cql));
    } else {
      dispatch(removeCustomCqlExpression(property));
    }
  };

  const title = "Select filters";
  return (
    <Dropdown
      multiSelect
      selectedKeys={existingProperties}
      ariaLabel={title}
      placeholder={title}
      options={options}
      onRenderTitle={renderPlaceholder(
        "Options",
        title,
        displayTextStyles,
        displayIconStyles
      )}
      styles={dropdownStyles}
      onChange={handleChange}
    />
  );
};

const getCurrentProperties = (cql: CqlParser | null) => {
  const existing = cql?.expressions.map(exp => exp.property);
  return existing || [];
};

const makeDropdownItems = (
  queryable: JSONSchema | undefined,
  existingProperties: string[]
): IDropdownOption[] => {
  const keys = Object.keys(queryable?.properties || {});
  const fields = queryable?.properties;

  return keys.map(key => {
    const field = fields?.[key] as JSONSchema;
    const exists = existingProperties.includes(key);
    const isAcquired = key === "datetime";
    const tooltip = isAcquired ? "This filter cannot be removed" : field.description;

    return {
      key,
      text: field.title || "",
      title: tooltip,
      data: field,
      checked: exists,
      disabled: isAcquired,
    };
  });
};

const theme = getTheme();
const displayTextStyles: ITextStyles = {
  root: {
    color: theme.palette.themePrimary,
    fontSize: FontSizes.small,
  },
};
const displayIconStyles: IIconStyles = {
  root: {
    marginRight: 4,
    width: 12,
    height: 12,
  },
};

const dropdownStyles: Partial<IDropdownStyles> = {
  title: {
    color: theme.palette.themePrimary,
    fontSize: FontSizes.small,
    span: {
      position: "relative",
      top: 1,
      color: theme.palette.themePrimary,
      fontSize: FontSizes.small,
    },
    i: {
      width: 14,
      height: 14,
      marginRight: 6,
      top: 4,
    },
    border: 0,
    padding: 0,
    "&:hover": {
      color: theme.palette.themePrimary + " !important",
    },
    "&:focus": {
      color: theme.palette.themePrimary + " !important",
    },
    "&:focus-visible": {
      color: theme.palette.themePrimary + " !important",
    },
    "&:focus-within": {
      color: theme.palette.themePrimary + " !important",
    },
    lineHeight: "unset",
    display: "inline",
  },
  dropdownItemSelected: {
    backgroundColor: theme.palette.white,
  },
  caretDownWrapper: {
    display: "none",
  },
  dropdown: {
    "&:focus:after": {
      border: "0px ",
    },
    "&:focus-visible": {
      outline: "1px solid",
      outlineColor: theme.palette.neutralSecondary,
      borderRadius: 2,
    },
  },
  callout: {
    minWidth: 200,
    marginTop: 5,
  },
};
