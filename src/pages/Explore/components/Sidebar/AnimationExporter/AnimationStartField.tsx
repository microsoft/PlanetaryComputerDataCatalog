import { CSSProperties } from "react";
import dayjs from "dayjs";
import {
  Calendar,
  Callout,
  DirectionalHint,
  getTheme,
  Icon,
  Label,
  Stack,
  TextField,
  TooltipHost,
} from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";

import { IStacCollection } from "types/stac";
import TemporalExtent from "components/stac/TemporalExtent";
import { firstInputStyle, stackTokens } from "./AnimationExporter.index";

interface AnimationStartFieldProps {
  collection: IStacCollection | null;
  validations: string[];
  value: string;
  onChange: (key: string, newValue: string | undefined) => void;
}

export const AnimationStartField: React.FC<AnimationStartFieldProps> = ({
  collection,
  validations,
  value,
  onChange,
}) => {
  const id = useId();
  const [showCalendar, { setFalse: hideCalendar, toggle }] = useBoolean(false);
  const temporal = collection?.extent?.temporal || null;

  const tooltip = temporal && (
    <Stack horizontal verticalAlign="center" tokens={stackTokens}>
      <Label>Start datetime (UTC)</Label>
      <TooltipHost
        content={<TemporalExtent extent={temporal} label="Valid date range" />}
      >
        <Icon iconName="Info" styles={tooltipIconStyles} />
      </TooltipHost>
    </Stack>
  );

  const dateValue = value ? dayjs(value).toDate() : undefined;

  const handleDateSelect = (date: Date) => {
    // Parse the value of the existing time and add it to the new date
    const time = dayjs(value).format("HH:mm:ss");
    const newValue = dayjs(date).format(`YYYY-MM-DDT${time}Z`);
    onChange("start", newValue);
    hideCalendar();
  };

  const handleDateChange = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string | undefined
  ) => onChange(e.currentTarget.name, newValue);

  const field = (
    <>
      <div style={containerStyles}>
        <TextField
          title="Timelapse starting datetime in UTC (YYYY-MM-DDTHH:mm:ssZ)"
          name="start"
          placeholder="YYYY-MM-DD"
          value={value}
          onChange={handleDateChange}
          errorMessage={validations[0]}
          styles={firstInputStyle}
          onRenderLabel={() => tooltip}
        />
        <button
          id={id}
          title="Calendar selector"
          style={calendarButtonStyle}
          onClick={toggle}
        >
          <Icon iconName="Calendar" />
        </button>
      </div>
      <Callout
        target={`#${id}`}
        hidden={!showCalendar}
        isBeakVisible={false}
        directionalHint={DirectionalHint.topRightEdge}
        onDismiss={hideCalendar}
      >
        <Calendar
          showMonthPickerAsOverlay
          showGoToToday={false}
          value={dateValue}
          onSelectDate={handleDateSelect}
        />
      </Callout>
    </>
  );

  return field;
};

const theme = getTheme();

const calendarButtonStyle: CSSProperties = {
  cursor: "pointer",
  position: "absolute",
  top: 37,
  right: 4,
  background: theme.semanticColors.bodyBackground,
  border: "none",
};

const containerStyles: CSSProperties = {
  position: "relative",
};

const tooltipIconStyles = {
  root: {
    cursor: "pointer",
  },
};
