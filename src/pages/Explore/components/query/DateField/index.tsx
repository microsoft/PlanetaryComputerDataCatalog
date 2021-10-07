import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Callout,
  DefaultButton,
  DirectionalHint,
  mergeStyleSets,
  getTheme,
  Stack,
} from "@fluentui/react";
import { getEndDay, getStartDay } from "utils";

import { useBoolean, useId } from "@fluentui/react-hooks";
import { CqlDate } from "pages/Explore/utils/cql/types";
import { opEnglish } from "../constants";
import CalendarControl from "./CalendarControl";
import ControlFooter from "../ControlFooter";
import { Dayjs } from "dayjs";
import { dayjs } from "utils";

interface DateFieldProps {
  dateExpression: CqlDate;
}

const getStartRangeValue = (d: CqlDate) => {
  return getStartDay(d.isRange ? d.value[0] : d.value);
};

const getEndRangeValue = (d: CqlDate) => {
  return getEndDay(d.isRange ? d.value[1] : undefined);
};

const DateField = ({ dateExpression }: DateFieldProps) => {
  const [startDate, setStart] = useState<Dayjs>(getStartRangeValue(dateExpression));
  const [endDate, setEnd] = useState<Dayjs>(getEndRangeValue(dateExpression));

  const [isCalloutVisible, { toggle }] = useBoolean(false);
  const buttonId = useId("query-daterange-button");
  const labelId = useId("query-daterange-label");

  const minDay = useMemo(() => {
    return dayjs(dateExpression.min);
  }, [dateExpression.min]);

  const maxDay = useMemo(() => {
    return dayjs(dateExpression.max);
  }, [dateExpression.max]);

  // When there is a new default expression, update the start and end date
  useEffect(() => {
    setStart(getStartRangeValue(dateExpression));
    setEnd(getEndRangeValue(dateExpression));
  }, [dateExpression]);

  const handleSave = useCallback(() => {}, []);

  const handleCancel = useCallback(() => {
    toggle();
  }, [toggle]);

  // Exact and range labels don't need an operator label, the dates will be self explanatory
  const opLabel = opEnglish[dateExpression.operator];
  const shouldUseLabel = ["gt", "gte", "lt", "lte"].includes(
    dateExpression.operator
  );

  const displayText = dateExpression.isRange
    ? dateExpression.value.join(" - ")
    : dateExpression.value;

  // Range or not?
  // Disable apply until changes
  // Disable apply if invalid

  return (
    <>
      <DefaultButton id={buttonId} onClick={toggle}>
        {shouldUseLabel && opLabel} {displayText}
      </DefaultButton>
      {isCalloutVisible && (
        <Callout
          className={styles.callout}
          ariaLabelledBy={labelId}
          role="alertdialog"
          gapSpace={0}
          target={`#${buttonId}`}
          onDismiss={toggle}
          directionalHint={DirectionalHint.bottomLeftEdge}
          isBeakVisible={false}
          setInitialFocus
        >
          <Stack horizontal tokens={{ childrenGap: 10 }}>
            <CalendarControl
              label="Start date"
              date={startDate}
              onSelectDate={setStart}
              validMinDate={minDay}
              validMaxDate={maxDay}
            />
            {dateExpression.isRange && (
              <CalendarControl
                label="End date"
                date={endDate}
                onSelectDate={setEnd}
                validMinDate={minDay}
                validMaxDate={maxDay}
              />
            )}
          </Stack>
          <ControlFooter onCancel={handleCancel} onSave={handleSave} />
        </Callout>
      )}
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
