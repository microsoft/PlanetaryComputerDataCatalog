import {
  Dropdown,
  IDropdownOption,
  IStackStyles,
  PrimaryButton,
  Stack,
  StackItem,
  TextField,
} from "@fluentui/react";
import dayjs from "dayjs";
import {
  addAnimation,
  selectAnimationsByCollection,
} from "pages/Explore/state/animationSlice";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { setShowAnimationPanel } from "pages/Explore/state/mapSlice";
import { selectCurrentMosaic } from "pages/Explore/state/mosaicSlice";
import { makeFilterBody } from "pages/Explore/utils/hooks/useStacFilter";
import { collectionFilter } from "pages/Explore/utils/stac";
import { useEffect, useState } from "react";
import { IStacFilter } from "types/stac";
import { useAnimationExport } from "utils/requests";
import { AnimationIntro } from "./AnimationIntro";
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
  duration: number;
}

const defaultConfig = {
  start: dayjs().subtract(6, "months").utc().toISOString(),
  step: 1,
  unit: "months",
  frames: 6,
  duration: 250,
};

export const AnimationExporter: React.FC<AnimationExporterProps> = () => {
  const dispatch = useExploreDispatch();
  const { collection, renderOption, query } =
    useExploreSelector(selectCurrentMosaic);
  const { bounds, zoom, showAnimationPanel } = useExploreSelector(s => s.map);
  const animations = useExploreSelector(s =>
    selectAnimationsByCollection(s, collection?.id)
  );
  const [configPayload, setConfigPayload] = useState<IAnimationExportConfig>();
  const [animConfig, setAnimConfig] = useState<IAnimationSettings>(defaultConfig);
  const {
    data: animationResp,
    isLoading,
    isError,
  } = useAnimationExport(configPayload);

  // When an animation response is received, add it to the list of animations
  // for this collection and reset the payload state used to request it.
  useEffect(() => {
    if (animationResp && collection?.id) {
      dispatch(
        addAnimation({
          animation: animationResp,
          collectionId: collection.id,
        })
      );
      setConfigPayload(undefined);
    }
  }, [animationResp, animations, collection?.id, dispatch]);

  if (!bounds) return null;
  if (!renderOption) return null;
  if (!collection) return null;

  // Build up the config payload to be used to request an animation
  // based on the current map/filter state.
  const collectionFragment = collectionFilter(collection.id);
  const cql = makeFilterBody([collectionFragment], query, query.cql);
  const mosaicConfig = {
    bbox: bounds,
    zoom: Math.round(zoom),
    render_params: renderOption.options + `&collection=${collection.id}`,
    cql,
  };

  // Todo: useeffect?
  if (isError) {
    setConfigPayload(undefined);
  }

  // Build the full payload to be used to request an animation
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
      <Stack horizontal horizontalAlign="start" tokens={{ childrenGap: 6 }}>
        <TextField
          label="Start date/time"
          name="start"
          placeholder="YYYY-MM-DDTHH:mm:ssZ"
          defaultValue={animConfig.start}
          onChange={handleChange}
        />
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
      </Stack>
      <Stack horizontal horizontalAlign="start" tokens={{ childrenGap: 6 }}>
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
        <TextField
          type="number"
          label="Frame duration (ms)"
          name="duration"
          min={1}
          step={1}
          defaultValue={animConfig.duration.toString()}
          onChange={handleChange}
        />
      </Stack>
      <StackItem shrink={false}>
        <PrimaryButton disabled={!exportEnabled} onClick={handleExport}>
          Generate animation
        </PrimaryButton>
      </StackItem>

      {(animations.length || isLoading) && (
        <AnimationResults
          collectionId={collection.id}
          animations={animations}
          isLoading={isLoading}
        />
      )}
    </Stack>
  );

  return showAnimationPanel ? panel : null;
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
