import {
  DefaultButton,
  Dropdown,
  IDropdownOption,
  Image,
  ImageFit,
  IStackStyles,
  PrimaryButton,
  Stack,
  Text,
  TextField,
} from "@fluentui/react";
import dayjs from "dayjs";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { setShowAnimationPanel } from "pages/Explore/state/mapSlice";
import { selectCurrentMosaic } from "pages/Explore/state/mosaicSlice";
import { makeFilterBody } from "pages/Explore/utils/hooks/useStacFilter";
import { collectionFilter } from "pages/Explore/utils/stac";
import { useState } from "react";

import { BoundsSelector } from "./BoundsSelector";

interface AnimationExporterProps {}
interface IAnimConfig {
  start: string;
  step: string;
  unit: string;
  frames: string;
}

export const AnimationExporter: React.FC<AnimationExporterProps> = () => {
  const [urlParams, setUrlParams] = useState<string>("");
  const [animConfig, setAnimConfig] = useState<IAnimConfig>({
    start: dayjs().utc().toISOString(),
    step: "5",
    unit: "months",
    frames: "12",
  });

  const { collection, renderOption, query } =
    useExploreSelector(selectCurrentMosaic);
  const { bounds, zoom, showAnimationPanel } = useExploreSelector(s => s.map);
  const dispatch = useExploreDispatch();
  const title = collection?.title;

  if (!bounds) return null;
  if (!renderOption) return null;

  const collectionFragment = collectionFilter(collection?.id);
  const cql = makeFilterBody([collectionFragment], query, query.cql);
  const mosaicConfig = {
    bbox: bounds.join(","),
    zoom: Math.round(zoom).toString(),
    render_params: renderOption.options + `&collection=${collection?.id}`,
    cql: JSON.stringify(cql),
  };

  const payload = { ...mosaicConfig, ...animConfig };

  const handleExport = () => {
    const params = new URLSearchParams(payload);
    setUrlParams(params.toString());
  };

  const handleChange = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string | undefined
  ) => {
    setAnimConfig({
      ...animConfig,
      [e.currentTarget.name]: newValue,
    });
  };

  const handleClose = () => {
    dispatch(setShowAnimationPanel(false));
  };

  const panel = (
    <Stack styles={containerStyles} tokens={{ childrenGap: 10 }}>
      <Stack horizontal horizontalAlign="space-between">
        <h3>Animation</h3>
        <DefaultButton iconProps={{ iconName: "Cancel" }} onClick={handleClose} />
      </Stack>
      <h4>{title}</h4>
      <Text>
        Generate an animated image of your current search over time. Start by drawing
        the area you want to capture on the map, and select the increment for each
        frame.
      </Text>
      <Text>
        Keep in mind that many datasets have an irregular temporal availability which
        might affect your results.
      </Text>
      <TextField
        label="Start date/time"
        name="start"
        placeholder="YYYY-MM-DDTHH:mm:ssZ"
        defaultValue={animConfig.start}
        onChange={handleChange}
      />
      <Stack horizontal horizontalAlign="start" tokens={{ childrenGap: 6 }}>
        <TextField
          name="step"
          label={"Increment amount"}
          min={2}
          step={1}
          defaultValue={animConfig.step}
          onChange={handleChange}
        />
        <Dropdown
          label="Unit"
          options={units}
          defaultSelectedKey={animConfig.unit}
          onChange={(_, option) =>
            setAnimConfig({ ...animConfig, unit: option?.key as string })
          }
        />
        <TextField
          label="Number of frames"
          name="frames"
          min={1}
          max={48}
          step={1}
          defaultValue={animConfig.frames}
          onChange={handleChange}
        />
      </Stack>
      {urlParams && (
        <Image
          alt="layer animation"
          src={`/api/animation?${urlParams}`}
          imageFit={ImageFit.contain}
        />
      )}
      <PrimaryButton onClick={handleExport}>Export</PrimaryButton>
    </Stack>
  );

  return showAnimationPanel ? panel : null;
  // return showAnimationPanel ? <BoundsSelector /> : null;
};

const units: IDropdownOption[] = [
  { key: "mins", text: "Minutes" },
  { key: "hours", text: "Hours" },
  { key: "days", text: "Days" },
  { key: "weeks", text: "Weeks" },
  { key: "months", text: "Months" },
  { key: "years", text: "Years" },
];

const containerStyles: Partial<IStackStyles> = {
  root: {
    height: "100%",
    overflowY: "auto",
    overflowX: "clip",
    padding: 10,
  },
};
