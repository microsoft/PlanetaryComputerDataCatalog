import { isEqual } from "lodash-es";
import { useExploreSelector } from "pages/Explore/state/hooks";
import { selectCurrentCql } from "pages/Explore/state/mosaicSlice";
import { CqlExpressionParser } from "pages/Explore/utils/cql";
import { CqlExpression } from "pages/Explore/utils/cql/types";

// Test the current mosaic cql to determine if a property/value combo is present.
// Assumes only a single level of nesting, as that is what the Explorer can produce.
const useCqlPropertyMatcher = () => {
  const cql = useExploreSelector(selectCurrentCql);

  return (property: string, value: string | number) => {
    const expression = cql
      .map((exp: CqlExpression) => new CqlExpressionParser(exp))
      .find(parser => parser.property === property);

    // If the expression does not include this property at all, then we must
    // assume this render option is potentially valid.
    if (!expression) {
      return true;
    }

    // Check that the operator and value indicate that we want to include the render option
    const inclusiveOperators = ["=", ">", ">=", "in", "between", "like"];
    const values = Array.isArray(expression.value)
      ? expression.value
      : [expression.value];
    return (
      (isEqual(values, value) || values.includes(value)) &&
      inclusiveOperators.includes(expression.operator)
    );
  };
};

export default useCqlPropertyMatcher;
