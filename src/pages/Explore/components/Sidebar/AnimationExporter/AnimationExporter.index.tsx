import {
  Dropdown,
  FontSizes,
  getTheme,
  IButtonStyles,
  IDropdownOption,
  IDropdownStyles,
  IStackStyles,
  ITextFieldStyles,
  ITextStyles,
  MessageBar,
  MessageBarType,
  PrimaryButton,
  Stack,
  StackItem,
  Text,
  TextField,
} from "@fluentui/react";
import {
  addAnimation,
  selectAnimationsByCollection,
} from "pages/Explore/state/animationSlice";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { setShowAnimationPanel } from "pages/Explore/state/mapSlice";
import { selectCurrentMosaic } from "pages/Explore/state/mosaicSlice";
import { makeFilterBody } from "pages/Explore/utils/hooks/useStacFilter";
import { collectionFilter } from "pages/Explore/utils/stac";
import { useState } from "react";
import { useAnimationExport } from "utils/requests";
import { AnimationIntro } from "./AnimationIntro";
import { AnimationResults } from "./AnimationResults";
import { getDefaultSettings, validate } from "./helpers";
import {
  AnimationConfig,
  AnimationFrameSettings,
  AnimationMosaicSettings,
} from "./types";

export const AnimationExporter: React.FC = () => {
  const dispatch = useExploreDispatch();
  const { collection, renderOption, query, layer } =
    useExploreSelector(selectCurrentMosaic);
  const { bounds, zoom, showAnimationPanel } = useExploreSelector(s => s.map);
  const animations = useExploreSelector(s =>
    selectAnimationsByCollection(s, collection?.id)
  );
  const [animationSettings, setAnimationSettings] = useState<AnimationFrameSettings>(
    getDefaultSettings(collection)
  );

  // Build up the config payload to be used to request an animation
  // based on the current map/filter state.
  const collectionFragment = collectionFilter(collection?.id);
  const cql = makeFilterBody([collectionFragment], query, query.cql);
  const mosaicConfig: AnimationMosaicSettings = {
    bbox: bounds,
    zoom: Math.round(zoom),
    render_params: renderOption?.options + `&collection=${collection?.id}`,
    cql,
  };

  const requestBody: AnimationConfig = { ...mosaicConfig, ...animationSettings };

  const {
    data: animationResp,
    isLoading,
    isError,
    refetch: fetchAnimation,
    remove: removeAnimationRespose,
  } = useAnimationExport(requestBody);

  // When an animation response is received, add it to the list of animations
  // for this collection and reset the payload state used to request it.
  if (
    animationResp &&
    collection &&
    !animations.find(a => a.url === animationResp.url)
  ) {
    dispatch(
      addAnimation({
        animation: animationResp,
        collectionId: collection.id,
      })
    );
    removeAnimationRespose();
  }

  const handleExportClick = () => {
    fetchAnimation({ stale: true });
  };

  const handleChange = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string | undefined
  ) => {
    const fieldName = e.currentTarget.name;
    const value = fieldName === "start" ? newValue : parseInt(newValue || "0", 10);
    setAnimationSettings({
      ...animationSettings,
      [fieldName]: value,
    });
  };

  const handleUnitChange = (_: any, option: IDropdownOption | undefined) =>
    setAnimationSettings({
      ...animationSettings,
      unit: option?.key as string,
    });

  const handleClose = () => {
    dispatch(setShowAnimationPanel(false));
  };

  const validation = validate(requestBody, collection, layer);
  const exportEnabled = !isLoading && validation.isValid;

  const panel = (
    <Stack styles={containerStyles} tokens={panelTokens}>
      <AnimationIntro
        collection={collection}
        renderOption={renderOption}
        handleClose={handleClose}
      />
      <Stack
        horizontal
        horizontalAlign="start"
        tokens={stackTokens}
        verticalAlign={"start"}
      >
        <TextField
          title="Datetime to start the timelapse from (YYYY-MM-DDTHH:mm:ssZ)"
          label="Start datetime"
          name="start"
          placeholder="YYYY-MM-DD"
          defaultValue={animationSettings.start}
          onChange={handleChange}
          errorMessage={validation.start[0]}
          styles={firstInputStyle}
        />
        <TextField
          type="number"
          name="step"
          label={"Increment"}
          min={1}
          step={1}
          defaultValue={animationSettings.step.toString()}
          onChange={handleChange}
          styles={inputStyles}
          errorMessage={validation.step[0]}
        />
        <Dropdown
          label="Unit"
          options={units}
          defaultSelectedKey={animationSettings.unit}
          onChange={handleUnitChange}
          styles={unitStyles}
        />
      </Stack>
      <Stack horizontal horizontalAlign="start" tokens={stackTokens}>
        <TextField
          type="number"
          label="No. of frames"
          name="frames"
          min={2}
          max={48}
          step={1}
          defaultValue={animationSettings.frames.toString()}
          onChange={handleChange}
          styles={firstInputStyle}
          errorMessage={validation.frames[0]}
        />
        <TextField
          type="number"
          label="Frame duration (ms)"
          name="duration"
          min={1}
          step={1}
          defaultValue={animationSettings.duration.toString()}
          styles={inputStyles}
          onChange={handleChange}
          errorMessage={validation.duration[0]}
        />
      </Stack>
      <StackItem shrink={false}>
        <PrimaryButton
          disabled={!exportEnabled}
          onClick={handleExportClick}
          styles={buttonStyles}
        >
          Generate animation
        </PrimaryButton>

        {Boolean(validation.map.length) && (
          <Text block styles={errorTextStyles}>
            * {validation.map[0]}
          </Text>
        )}
        {isError && (
          <MessageBar messageBarType={MessageBarType.error}>
            Sorry, something went wrong with that request.
          </MessageBar>
        )}
      </StackItem>

      {(animations.length || isLoading) && collection && (
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

const theme = getTheme();
const stackTokens = { childrenGap: 6 };
const panelTokens = { childrenGap: 10 };

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

const firstInputStyle: Partial<ITextFieldStyles> = {
  root: {
    width: 172,
  },
};

const inputStyles: Partial<ITextFieldStyles> = {
  root: {
    width: 136,
  },
};

const unitStyles: Partial<IDropdownStyles> = {
  root: {
    width: 90,
  },
};

const buttonStyles: Partial<IButtonStyles> = {
  root: {
    marginTop: 10,
  },
};

const errorTextStyles: Partial<ITextStyles> = {
  root: {
    color: theme.semanticColors.errorText,
    fontSize: FontSizes.small,
  },
};
