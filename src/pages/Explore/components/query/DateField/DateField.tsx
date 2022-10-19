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
  TooltipHost,
  Text,
} from "@fluentui/react";

import CalendarControl from "./CalendarControl";
import { CqlDate } from "pages/Explore/utils/cql/types";
import { opEnglish } from "../constants";
import { DateFieldProvider, IDateFieldContext } from "./context";
import { capitalize } from "utils";
import {
  getDateDisplayText,
  isSingleDayRange,
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
import { formatDateShort, getDayEnd, getDayStart } from "pages/Explore/utils/time";

interface DateFieldProps {
  dateExpression: CqlDate;
  disabled?: boolean;
}

export const DateField = ({ dateExpression, disabled = false }: DateFieldProps) => {
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

  const minDay = getDayStart(dateExpression.min);
  const maxDay = getDayEnd(dateExpression.max);

  const { OperatorSelector, operatorSelection } = useOperatorSelector(
    dateExpression,
    initialDateRange
  );

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
      dispatch(setCustomCqlExpressions(exp));
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
  };

  const handleRenderText = () => {
    const displayValue = `${capitalize(opLabel)} ${displayText}`;
    return (
      <DropdownLabel
        key="datefield-button-label"
        label="Acquired"
        displayValue={displayValue}
        title={displayValue}
      />
    );
  };

  useEffect(() => {
    handleSave();
  }, [handleSave, workingDateRange, operatorSelection.key]);

  const isSingleDay = isSingleDayRange(dateExpression);
  const isDisabled = isSingleDay || disabled;
  const disabledMsg = isSingleDay ? (
    <Text>
      <Text style={{ fontWeight: 500 }}>
        {formatDateShort(initialDateRange.start)}
      </Text>{" "}
      is the only date available for this dataset
    </Text>
  ) : (
    ""
  );
  return (
    <>
      <TooltipHost content={disabledMsg}>
        <DropdownButton
          ref={panelRef}
          key={"query-datetime-field"}
          label="Date acquired"
          directionalHint={DirectionalHint.rightTopEdge}
          onRenderText={handleRenderText}
          disabled={isDisabled}
        >
          <DateFieldProvider state={providerState}>
            <Stack
              horizontal
              styles={commandBarStyles}
              horizontalAlign={"space-between"}
            >
              {OperatorSelector}
            </Stack>
            <Separator styles={separatorStyles} />
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
          </DateFieldProvider>
        </DropdownButton>
      </TooltipHost>
    </>
  );
};

const theme = getTheme();
const calendarTokens: IStackTokens = {
  childrenGap: 0,
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
  content: {
    display: "block",
  },
};

const dividerStyles: IVerticalDividerStyles = {
  wrapper: {
    height: "auto",
  },
  divider: {
    height: "100%",
    backgroundColor: theme.palette.neutralLight,
  },
};
