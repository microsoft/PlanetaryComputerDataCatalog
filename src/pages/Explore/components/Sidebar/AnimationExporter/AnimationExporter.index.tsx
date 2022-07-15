import {
  Dropdown,
  getTheme,
  IconButton,
  IDropdownOption,
  Image,
  ImageFit,
  IStackStyles,
  PrimaryButton,
  Stack,
  StackItem,
  Text,
  TextField,
} from "@fluentui/react";
import dayjs from "dayjs";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { setShowAnimationPanel } from "pages/Explore/state/mapSlice";
import { selectCurrentMosaic } from "pages/Explore/state/mosaicSlice";
import { makeFilterBody } from "pages/Explore/utils/hooks/useStacFilter";
import { collectionFilter } from "pages/Explore/utils/stac";
import { useEffect, useState } from "react";
import { IStacFilter } from "types/stac";
import { useAnimationExport } from "utils/requests";
import { AnimationIntro } from "./AnimationIntro";
import { AnimationResponse } from "./AnimationResult";
import { AnimationResults } from "./AnimationResults";

interface AnimationExporterProps {}
export interface IAnimationExportConfig extends IAnimationSettings {
  bbox: number[];
  zoom: number;
  cql: IStacFilter;
}

interface IAnimationSettings {
  start: string;
  step: number;
  unit: string;
  frames: number;
}

const defaultConfig = {
  start: dayjs().utc().toISOString(),
  step: 5,
  unit: "months",
  frames: 6,
};

export const AnimationExporter: React.FC<AnimationExporterProps> = () => {
  const dispatch = useExploreDispatch();
  const { collection, renderOption, query } =
    useExploreSelector(selectCurrentMosaic);
  const { bounds, zoom, showAnimationPanel } = useExploreSelector(s => s.map);
  const [configPayload, setConfigPayload] = useState<IAnimationExportConfig>();
  const [animations, setAnimations] = useState<AnimationResponse[]>([]);
  const [animConfig, setAnimConfig] = useState<IAnimationSettings>(defaultConfig);
  const {
    data: animationResp,
    isLoading,
    isError,
  } = useAnimationExport(configPayload);

  useEffect(() => {
    if (animationResp) {
      setAnimations(animations.concat([animationResp]));
      setConfigPayload(undefined);
    }
  }, [animationResp, animations]);

  if (!bounds) return null;
  if (!renderOption) return null;

  const collectionFragment = collectionFilter(collection?.id);
  const cql = makeFilterBody([collectionFragment], query, query.cql);
  const mosaicConfig = {
    bbox: bounds,
    zoom: Math.round(zoom),
    render_params: renderOption.options + `&collection=${collection?.id}`,
    cql,
  };

  if (isError) {
    setConfigPayload(undefined);
  }

  const handleExport = () => {
    const payload = { ...mosaicConfig, ...animConfig };
    setConfigPayload(payload);
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

  const exportEnabled = !Boolean(animationResp) && !isLoading;

  const panel = (
    <Stack styles={containerStyles} tokens={{ childrenGap: 10 }}>
      <AnimationIntro collection={collection} handleClose={handleClose} />
      <TextField
        label="Start date/time"
        name="start"
        placeholder="YYYY-MM-DDTHH:mm:ssZ"
        defaultValue={animConfig.start}
        onChange={handleChange}
      />
      <Stack horizontal horizontalAlign="start" tokens={{ childrenGap: 6 }}>
        <TextField
          type="number"
          name="step"
          label={"Increment amount"}
          min={2}
          step={1}
          defaultValue={animConfig.step.toString()}
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
          type="number"
          label="Number of frames"
          name="frames"
          min={1}
          max={48}
          step={1}
          defaultValue={animConfig.frames.toString()}
          onChange={handleChange}
        />
      </Stack>
      <StackItem shrink={false}>
        <PrimaryButton disabled={!exportEnabled} onClick={handleExport}>
          Generate animation
        </PrimaryButton>
      </StackItem>

      {animations.length && (
        <AnimationResults animations={animations} isLoading={isLoading} />
      )}
    </Stack>
  );

  return showAnimationPanel ? panel : null;
};

const theme = getTheme();

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
