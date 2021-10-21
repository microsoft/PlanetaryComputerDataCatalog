import { useCallback, useMemo, useReducer, useState, useRef } from "react";
import {
  Stack,
  IStackTokens,
  Text,
  IIconProps,
  VerticalDivider,
  IVerticalDividerStyles,
  IContextualMenuItem,
  CommandButton,
  IContextualMenuProps,
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
import { useExploreDispatch } from "pages/Explore/state/hooks";
import { setCustomCqlExpression } from "pages/Explore/state/mosaicSlice";
import { DropdownButton } from "../DropdownButton";
import { PanelControlHandlers } from "pages/Explore/components/Map/components/PanelControl";

interface DateFieldProps {
  dateExpression: CqlDate;
}

export const DateField = ({ dateExpression }: DateFieldProps) => {
  const [currentOp, setCurrentOp] = useState<IContextualMenuItem>(
    opItemFromExpression(dateExpression)
  );
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

  const dispatch = useExploreDispatch();
  const panelRef = useRef<PanelControlHandlers>(null);
  const togglePanel = useCallback(() => {
    panelRef.current?.togglePanel();
  }, []);

  const minDay = useMemo(() => {
    return getDayStart(dateExpression.min);
  }, [dateExpression.min]);

  const maxDay = useMemo(() => {
    return getDayEnd(dateExpression.max);
  }, [dateExpression.max]);

  const handleSave = useCallback(() => {
    const exp = toCqlExpression(workingDateRange);
    dispatch(setCustomCqlExpression(exp));
    togglePanel();
  }, [dispatch, togglePanel, workingDateRange]);

  const opLabel = opEnglish[dateExpression.operator];
  const displayText = getDateDisplayText(dateExpression);

  const providerState = {
    validMinDate: minDay,
    validMaxDate: maxDay,
    setValidation: validationDispatch,
  };

  return (
    <>
      <DropdownButton
        ref={panelRef}
        key={"query-datetime-field"}
        label="Date acquired"
        iconProps={iconProps}
        onRenderText={() => {
          return (
            <Stack key="datetime-selector-label" horizontal horizontalAlign="start">
              <Text>
                Acquired: {opLabel} {displayText}
              </Text>
            </Stack>
          );
        }}
      >
        <CommandButton text={currentOp.text} menuProps={menuProps} />
        <DateFieldProvider state={providerState}>
          <Stack horizontal tokens={calendarTokens}>
            <CalendarControl
              rangeType="start"
              date={workingDateRange.start}
              onSelectDate={workingDateRangeDispatch}
            />
            {dateExpression.isRange && (
              <>
                <VerticalDivider styles={dividerStyles} />
                <CalendarControl
                  rangeType="end"
                  date={workingDateRange.end}
                  onSelectDate={workingDateRangeDispatch}
                />
              </>
            )}
          </Stack>
          <ControlFooter
            onCancel={togglePanel}
            onSave={handleSave}
            isValid={isValidToApply(
              controlValidState,
              initialDateRange,
              workingDateRange
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
  wrapper: { marginTop: 55 },
  divider: {
    height: 265,
    background:
      "linear-gradient(rgba(200, 198, 196, .0) , rgb(223 221 220), rgba(200, 198, 196, .0) )",
  },
};

const menuProps: IContextualMenuProps = {
  items: [
    { key: "eq", text: "On date" },
    { key: "gte", text: "On or after date" },
    { key: "lte", text: "On or before date" },
    { key: "anyinteracts", text: "Between dates" },
  ],
};
const opItemFromExpression = (dateExpression: CqlDate): IContextualMenuItem => {
  const item = menuProps.items.find(item => item.key === dateExpression.operator);

  if (!item) {
    throw new Error(
      `Unable to find operator "${dateExpression.operator}" for date control`
    );
  }

  return item;
};
