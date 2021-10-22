import { useCallback, useMemo, useReducer, useRef } from "react";
import {
  Stack,
  IStackTokens,
  Text,
  IIconProps,
  VerticalDivider,
  IVerticalDividerStyles,
} from "@fluentui/react";

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
import useOperatorSelector from "./useOperatorSelector";
import { useExploreDispatch } from "pages/Explore/state/hooks";
import { setCustomCqlExpression } from "pages/Explore/state/mosaicSlice";
import { DropdownButton } from "../DropdownButton";
import { PanelControlHandlers } from "pages/Explore/components/Map/components/PanelControl";

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

  const togglePanel = useCallback(() => {
    panelRef.current?.togglePanel();
  }, []);

  const minDay = getDayStart(dateExpression.min);
  const maxDay = getDayEnd(dateExpression.max);

  const { OperatorSelector, operatorSelection, resetOperatorSelection } =
    useOperatorSelector(dateExpression);

  const handleCancel = () => {
    workingDateRangeDispatch(initialDateRange);
    resetOperatorSelection();
    togglePanel();
  };

  const handleSave = useCallback(() => {
    const exp = toCqlExpression(workingDateRange, operatorSelection.key);
    console.log(exp);
    dispatch(setCustomCqlExpression(exp));
    togglePanel();
  }, [operatorSelection.key, dispatch, togglePanel, workingDateRange]);

  const opLabel = opEnglish[dateExpression.operator];
  const displayText = getDateDisplayText(dateExpression);
  const isRange = operatorSelection.key === "between";

  const providerState = {
    validMinDate: minDay,
    validMaxDate: maxDay,
    setValidation: validationDispatch,
  };

  const handleRenderText = () => {
    return (
      <Stack key="datetime-selector-label" horizontal horizontalAlign="start">
        <Text>
          Acquired: {opLabel} {displayText}
        </Text>
      </Stack>
    );
  };

  return (
    <>
      <DropdownButton
        ref={panelRef}
        key={"query-datetime-field"}
        label="Date acquired"
        iconProps={iconProps}
        onRenderText={handleRenderText}
      >
        {OperatorSelector}
        <DateFieldProvider state={providerState}>
          <Stack horizontal tokens={calendarTokens}>
            <CalendarControl
              label={isRange ? "Start date" : ""}
              rangeType="start"
              date={workingDateRange.start}
              onSelectDate={workingDateRangeDispatch}
            />
            {isRange && (
              <>
                <VerticalDivider styles={dividerStyles} />
                <CalendarControl
                  label="End date"
                  rangeType="end"
                  date={workingDateRange.end}
                  onSelectDate={workingDateRangeDispatch}
                />
              </>
            )}
          </Stack>
          <ControlFooter
            onCancel={handleCancel}
            onSave={handleSave}
            isValid={isValidToApply(
              controlValidState,
              initialDateRange,
              workingDateRange,
              dateExpression.operator,
              operatorSelection.key
            )}
          />
        </DateFieldProvider>
      </DropdownButton>
    </>
  );
};

const calendarTokens: IStackTokens = {
  childrenGap: 10,
};

const iconProps: IIconProps = {
  iconName: "Calendar",
};

const dividerStyles: IVerticalDividerStyles = {
  wrapper: {
    marginTop: 55,
  },
  divider: {
    height: 265,
    background:
      "linear-gradient(rgba(200, 198, 196, .0) , rgb(223 221 220), rgba(200, 198, 196, .0) )",
  },
};
