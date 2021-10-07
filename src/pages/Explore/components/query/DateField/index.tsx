import { useCallback, useEffect, useMemo, useReducer } from "react";
import {
  Callout,
  DefaultButton,
  DirectionalHint,
  mergeStyleSets,
  getTheme,
  Stack,
} from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";

import CalendarControl from "./CalendarControl";
import ControlFooter from "../ControlFooter";
import { CqlDate } from "pages/Explore/utils/cql/types";
import { opEnglish } from "../constants";
import { DateFieldProvider } from "./context";
import { getDayEnd, getDayStart } from "utils";
import {
  getDateDisplayText,
  getEndRangeValue,
  getStartRangeValue,
  isValidToApply,
} from "./helpers";
import {
  dateRangeReducer,
  initialValidationState,
  validationReducer,
} from "./state";

interface DateFieldProps {
  dateExpression: CqlDate;
}

const DateField = ({ dateExpression }: DateFieldProps) => {
  const initialDateRange = useMemo(() => {
    return {
      start: getStartRangeValue(dateExpression),
      end: getEndRangeValue(dateExpression),
    };
  }, [dateExpression]);

  const [workingDateRange, workingDateRangeDispatch] = useReducer(
    dateRangeReducer,
    initialDateRange
  );

  const [controlValidState, validationDispatch] = useReducer(
    validationReducer,
    initialValidationState
  );

  const [isCalloutVisible, { toggle }] = useBoolean(false);
  const buttonId = useId("query-daterange-button");
  const labelId = useId("query-daterange-label");

  const minDay = useMemo(() => {
    return getDayStart(dateExpression.min);
  }, [dateExpression.min]);

  const maxDay = useMemo(() => {
    return getDayEnd(dateExpression.max);
  }, [dateExpression.max]);

  // When there is a new default expression, update the start and end date
  useEffect(() => {
    workingDateRangeDispatch({
      start: getStartRangeValue(dateExpression),
      end: getEndRangeValue(dateExpression),
    });
  }, [dateExpression]);

  const handleSave = useCallback(() => {
    console.log("going to save", workingDateRange);
    toggle();
  }, [toggle, workingDateRange]);

  const handleCancel = useCallback(() => {
    toggle();
  }, [toggle]);

  // Exact and range labels don't need an operator label, the dates will be self explanatory
  const opLabel = opEnglish[dateExpression.operator];
  const shouldUseLabel = ["gt", "gte", "lt", "lte"].includes(
    dateExpression.operator
  );

  const displayText = getDateDisplayText(dateExpression);

  // Range or not?
  // Disable apply until changes

  return (
    <>
      <DefaultButton id={buttonId} onClick={toggle}>
        {shouldUseLabel && opLabel} {displayText}
      </DefaultButton>
      <DateFieldProvider
        state={{
          validMinDate: minDay,
          validMaxDate: maxDay,
          setValidation: validationDispatch,
        }}
      >
        {isCalloutVisible && (
          <Callout
            className={styles.callout}
            ariaLabelledBy={labelId}
            gapSpace={0}
            target={`#${buttonId}`}
            onDismiss={toggle}
            directionalHint={DirectionalHint.bottomLeftEdge}
            isBeakVisible={false}
            setInitialFocus
          >
            <Stack horizontal tokens={{ childrenGap: 10 }}>
              <CalendarControl
                rangeType="start"
                date={workingDateRange.start}
                onSelectDate={workingDateRangeDispatch}
              />
              {dateExpression.isRange && (
                <CalendarControl
                  rangeType="end"
                  date={workingDateRange.end}
                  onSelectDate={workingDateRangeDispatch}
                />
              )}
            </Stack>
            <ControlFooter
              onCancel={handleCancel}
              onSave={handleSave}
              isValid={isValidToApply(
                controlValidState,
                initialDateRange,
                workingDateRange
              )}
            />
          </Callout>
        )}
      </DateFieldProvider>
    </>
  );
};

export default DateField;

const styles = mergeStyleSets({
  callout: {
    // minWidth: 420,
    padding: "20px 24px",
    backgroundColor: getTheme().semanticColors.bodyBackground,
  },
});
