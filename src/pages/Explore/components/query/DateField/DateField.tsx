import { useCallback, useMemo, useReducer } from "react";
import {
  Callout,
  DirectionalHint,
  mergeStyleSets,
  getTheme,
  Stack,
  IStackTokens,
  Text,
} from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";

import CalendarControl from "./CalendarControl";
import ControlFooter from "../ControlFooter";
import { CqlDate } from "pages/Explore/utils/cql/types";
import { opEnglish } from "../constants";
import { DateFieldProvider } from "./context";
import { getDayEnd, getDayStart } from "utils";
import {
  getDateDisplayText,
  isValidToApply,
  toCqlExpression,
  toDateRange,
} from "./helpers";
import {
  dateRangeReducer,
  initialValidationState,
  validationReducer,
} from "./state";
import { useExploreDispatch } from "pages/Explore/state/hooks";
import { setCustomCqlExpression } from "pages/Explore/state/mosaicSlice";
import { DropdownButton } from "../DropdownButton";

interface DateFieldProps {
  dateExpression: CqlDate;
}

const buttonId = "query-daterange-button";
const labelId = "query-daterange-label";

export const DateField = ({ dateExpression }: DateFieldProps) => {
  const initialDateRange = useMemo(() => {
    return toDateRange(dateExpression);
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
  const dispatch = useExploreDispatch();

  const minDay = useMemo(() => {
    return getDayStart(dateExpression.min);
  }, [dateExpression.min]);

  const maxDay = useMemo(() => {
    return getDayEnd(dateExpression.max);
  }, [dateExpression.max]);

  const handleSave = useCallback(() => {
    const exp = toCqlExpression(workingDateRange);
    dispatch(setCustomCqlExpression(exp));
    toggle();
  }, [dispatch, toggle, workingDateRange]);

  const opLabel = opEnglish[dateExpression.operator];
  const displayText = getDateDisplayText(dateExpression);

  const providerState = {
    validMinDate: minDay,
    validMaxDate: maxDay,
    setValidation: validationDispatch,
  };

  // Range or not?

  return (
    <>
      <DropdownButton
        label="Date acquired"
        id={buttonId}
        onClick={toggle}
        iconProps={{ iconName: "Calendar" }}
        onRenderText={() => {
          return (
            <Stack key="datetime-selector" horizontal horizontalAlign="start">
              <Text>
                Acquired: {opLabel} {displayText}
              </Text>
            </Stack>
          );
        }}
      />
      <DateFieldProvider state={providerState}>
        {isCalloutVisible && (
          <Callout
            role="dialog"
            className={styles.callout}
            ariaLabelledBy={labelId}
            gapSpace={0}
            target={`#${buttonId}`}
            onDismiss={toggle}
            directionalHint={DirectionalHint.bottomLeftEdge}
            isBeakVisible={false}
            setInitialFocus
          >
            <Stack horizontal tokens={calendarTokens}>
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
              onCancel={toggle}
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

const styles = mergeStyleSets({
  callout: {
    // minWidth: 420,
    padding: "20px 24px",
    backgroundColor: getTheme().semanticColors.bodyBackground,
  },
});

const calendarTokens: IStackTokens = {
  childrenGap: 10,
};
