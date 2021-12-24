import { cloneDeep } from "lodash-es";

import { CQL_PROP_IDX, CQL_VALS_IDX } from "pages/Explore/utils/constants";
import { CqlExpression } from "pages/Explore/utils/cql/types";
import { IStacFilter } from "types/stac";

export const stripCommonFilterElements = (cqlFilter: IStacFilter) => {
  const aoiExp = getByProperty("geometry", cqlFilter);
  const dtExp = getByProperty("datetime", cqlFilter);

  // The template depends on both values being present
  if (!aoiExp || !dtExp) return null;

  const aoiVal = aoiExp.args[CQL_VALS_IDX];
  const dtVal = dtExp.args[CQL_VALS_IDX];

  const aoi = replaceValueWithVar(aoiExp, "aoi", "$");
  const datetime = replaceValueWithVar(dtExp, "daterange", "*");

  const body = getAllWithout(["geometry", "datetime"], cqlFilter);
  const fullBody = [aoi.exp, datetime.exp, ...body];

  return {
    datetime: { ...datetime, value: dtVal },
    aoi: { ...aoi, value: aoiVal },
    fullBody,
  };
};

const getByProperty = (property: string, cqlFilter: IStacFilter) => {
  const exp = cqlFilter.filter.args.find(
    exp => exp.args[CQL_PROP_IDX].property === property
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
  exp: CqlExpression,
  varName: string,
  replaceChar: string
) => {
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
