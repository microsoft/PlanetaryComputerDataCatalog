import { useEffect, useState } from "react";
import {
  Callout,
  DefaultButton,
  DirectionalHint,
  mergeStyleSets,
  getTheme,
  Stack,
} from "@fluentui/react";
import { dayjs } from "utils";

import { useBoolean, useId } from "@fluentui/react-hooks";
import { CqlDate } from "pages/Explore/utils/cql/types";
import { opEnglish } from "../constants";
import CalendarControl from "./CalendarControl";

interface DateFieldProps {
  dateExpression: CqlDate;
}

const getStartRangeValue = (d: CqlDate) => {
  return dayjs(d.isRange ? d.value[0] : d.value).toDate();
};
const getEndRangeValue = (d: CqlDate) => {
  return dayjs(d.isRange ? d.value[1] : undefined).toDate();
};

const DateField = ({ dateExpression }: DateFieldProps) => {
  const [startDate, setStart] = useState<Date>(getStartRangeValue(dateExpression));
  const [endDate, setEnd] = useState<Date>(getEndRangeValue(dateExpression));

  const [isCalloutVisible, { toggle }] = useBoolean(false);
  const buttonId = useId("query-daterange-button");
  const labelId = useId("query-daterange-label");

  useEffect(() => {
    setStart(getStartRangeValue(dateExpression));
    setEnd(getEndRangeValue(dateExpression));
  }, [dateExpression]);

  const opLabel = opEnglish[dateExpression.operator];
  const useLabel = ["gt", "gte", "lt", "lte"].includes(dateExpression.operator);

  const l = dateExpression.isRange
    ? dateExpression.value.join(" - ")
    : dateExpression.value;

  // Callout with calendar settings for range or not

  // Time selector
  return (
    <>
      <DefaultButton id={buttonId} onClick={toggle}>
        {useLabel && opLabel} {l}
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
              validMinDate={dayjs.utc(dateExpression.min).toDate()}
              validMaxDate={dayjs.utc(dateExpression.max).toDate()}
            />
            {dateExpression.isRange && (
              <CalendarControl
                label="End date"
                date={endDate}
                onSelectDate={setEnd}
                validMinDate={dayjs.utc(dateExpression.min).toDate()}
                validMaxDate={dayjs.utc(dateExpression.max).toDate()}
              />
            )}
          </Stack>
        </Callout>
      )}
    </>
  );
};

export default DateField;

const styles = mergeStyleSets({
  callout: {
    minWidth: 420,
    padding: "20px 24px",
    backgroundColor: getTheme().semanticColors.bodyBackground,
  },
});
