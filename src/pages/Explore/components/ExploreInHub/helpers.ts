import { cloneDeep } from "lodash-es";

import { CQL_PROP_IDX, CQL_VALS_IDX } from "pages/Explore/utils/constants";
import { CqlExpression } from "pages/Explore/utils/cql/types";
import { IStacFilter } from "types/stac";

export const stripCommonFilterElements = (cqlFilter: IStacFilter) => {
  // Pluck out the properties we want to use as variables
  const aoiExp = getByProperty("geometry", cqlFilter);
  const dtExp = getByProperty("datetime", cqlFilter);

  const aoiVal = aoiExp?.args[CQL_VALS_IDX];
  const dtVal = dtExp?.args[CQL_VALS_IDX];

  // Create a mapping between the variable name and the value
  const aoi = replaceValueWithVar(aoiExp, "aoi", "$");
  const datetime = replaceValueWithVar(dtExp, "daterange", "^");

  // Reconstruct the full body with the special expression values mapped to the
  // variable names. Remove any optional ones like datetime.
  const body = getAllWithout(["geometry", "datetime"], cqlFilter);
  const fullBody = [aoi?.exp, datetime?.exp, ...body].filter(Boolean);

  // Return a data structure allowing the template to be rendered
  return {
    datetime: { ...datetime, value: dtVal },
    aoi: { ...aoi, value: aoiVal },
    fullBody,
  };
};

const getByProperty = (
  property: string,
  cqlFilter: IStacFilter
): CqlExpression | undefined => {
  const exp = cqlFilter.filter.args.find(
    exp => exp?.args[CQL_PROP_IDX]?.property === property
  );
  return exp;
};

const getAllWithout = (properties: string[], cqlFilter: IStacFilter) => {
  const exp = cqlFilter.filter.args.filter(
    exp => !properties.includes(exp.args[CQL_PROP_IDX].property)
  );
  return exp;
};

const replaceValueWithVar = (
  exp: CqlExpression | undefined,
  varName: string,
  replaceChar: string
) => {
  if (!exp)
    return {
      replace: { this: "", with: "" },
      exp: null,
    };

  const len = varName.length;
  if (len < 3) {
    throw new Error(`Variable name must be at least 3 characters long`);
  }

  const placeholder = "".padEnd(len - 2, replaceChar);
  const newExp = cloneDeep(exp);
  newExp.args[CQL_VALS_IDX] = placeholder;

  return {
    replace: {
      this: `"${placeholder}"`,
      with: varName,
    },
    exp: newExp,
  };
};
