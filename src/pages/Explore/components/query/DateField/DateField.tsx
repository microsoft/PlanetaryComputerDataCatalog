import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import {
  Stack,
  IStackTokens,
  VerticalDivider,
  IVerticalDividerStyles,
  Separator,
  getTheme,
  DirectionalHint,
  ISeparatorStyles,
  IStackStyles,
} from "@fluentui/react";

import CalendarControl from "./CalendarControl";
import { CqlDate } from "pages/Explore/utils/cql/types";
import { opEnglish } from "../constants";
import { DateFieldProvider, IDateFieldContext } from "./context";
import { capitalize, getDayEnd, getDayStart } from "utils";
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
import useOperatorSelector from "./useOperatorSelector";
import { useExploreDispatch } from "pages/Explore/state/hooks";
import { setCustomCqlExpressions } from "pages/Explore/state/mosaicSlice";
import { DropdownButton } from "../DropdownButton";
import { PanelControlHandlers } from "pages/Explore/components/Map/components/PanelControl";
import DropdownLabel from "../components/DropdownLabel";

interface DateFieldProps {
  dateExpression: CqlDate;
}

export const DateField = ({ dateExpression }: DateFieldProps) => {
  const dispatch = useExploreDispatch();
  const panelRef = useRef<PanelControlHandlers>(null);

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

  const minDay = getDayStart(dateExpression.min, true);
  const maxDay = getDayEnd(dateExpression.max, true);

  const { OperatorSelector, operatorSelection /*resetOperatorSelection */ } =
    useOperatorSelector(dateExpression);

  const isValid = isValidToApply(
    controlValidState,
    initialDateRange,
    workingDateRange,
    dateExpression.operator,
    operatorSelection.key
  );

  const handleSave = useCallback(() => {
    if (isValid) {
      const exp = toCqlExpression(workingDateRange, operatorSelection.key);
      dispatch<any>(setCustomCqlExpressions(exp));
    }
  }, [isValid, workingDateRange, operatorSelection.key, dispatch]);

  const opLabel = opEnglish[dateExpression.operator];
  const displayText = getDateDisplayText(dateExpression);
  const isRange = operatorSelection.key === "between";

  const providerState: IDateFieldContext = {
    validMinDate: minDay,
    validMaxDate: maxDay,
    workingDates: workingDateRange,
    setValidation: validationDispatch,
    validationState: controlValidState,
    signalApply: handleSave,
  };

  const handleRenderText = () => {
    const displayValue = `${capitalize(opLabel)} ${displayText}`;
    return (
      <DropdownLabel
        key="datefield-button-label"
        label="Acquired"
        displayValue={displayValue}
      />
    );
  };

  useEffect(() => {
    handleSave();
  }, [handleSave, workingDateRange, operatorSelection.key]);

  return (
    <>
      <DropdownButton
        ref={panelRef}
        key={"query-datetime-field"}
        label="Date acquired"
        directionalHint={DirectionalHint.rightTopEdge}
        onRenderText={handleRenderText}
      >
        <DateFieldProvider state={providerState}>
          <Stack horizontal tokens={calendarTokens}>
            <CalendarControl
              label={isRange ? "Start date" : ""}
              rangeType="start"
              operator={operatorSelection.key}
              onSelectDate={workingDateRangeDispatch}
            />
            {isRange && (
              <>
                <VerticalDivider styles={dividerStyles} />
                <CalendarControl
                  label="End date"
                  rangeType="end"
                  operator={operatorSelection.key}
                  onSelectDate={workingDateRangeDispatch}
                />
              </>
            )}
          </Stack>
          {!isValid && controlValidState.end}
          <Separator styles={separatorStyles} />
          <Stack
            horizontal
            styles={commandBarStyles}
            horizontalAlign={"space-between"}
          >
            {OperatorSelector}
            <Stack horizontal>Reset | Remove</Stack>
          </Stack>
        </DateFieldProvider>
      </DropdownButton>
    </>
  );
};

const theme = getTheme();
const calendarTokens: IStackTokens = {
  childrenGap: theme.spacing.s2,
};

const commandBarStyles: Partial<IStackStyles> = {
  root: {
    paddingLeft: theme.spacing.s1,
    paddingRight: theme.spacing.s1,
  },
};

const separatorStyles: Partial<ISeparatorStyles> = {
  root: {
    padding: 0,
  },
};

const dividerStyles: IVerticalDividerStyles = {
  wrapper: {
    marginTop: 0,
  },
  divider: {
    height: 255,
    backgroundColor: theme.palette.neutralLight,
  },
};
