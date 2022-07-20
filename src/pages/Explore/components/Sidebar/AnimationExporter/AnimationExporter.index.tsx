import {
  DefaultButton,
  Dropdown,
  FontSizes,
  getTheme,
  IButtonStyles,
  IDropdownOption,
  IDropdownStyles,
  IStackStyles,
  ITextFieldStyles,
  ITextStyles,
  PrimaryButton,
  Stack,
  StackItem,
  Text,
  TextField,
} from "@fluentui/react";
import { AxiosError } from "axios";

import {
  addAnimation,
  selectAnimationsByCollection,
} from "pages/Explore/state/animationSlice";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import {
  setBboxDrawMode,
  setDrawnBbox,
  setShowAnimationPanel,
} from "pages/Explore/state/mapSlice";
import { selectCurrentMosaic } from "pages/Explore/state/mosaicSlice";
import { makeFilterBody } from "pages/Explore/utils/hooks/useStacFilter";
import { collectionFilter } from "pages/Explore/utils/stac";
import { useState } from "react";
import { useAnimationExport } from "utils/requests";
import { AnimationError } from "./AnimationError";
import { AnimationIntro } from "./AnimationIntro";
import { AnimationResults } from "./AnimationResults";
import { AnimationStartField } from "./AnimationStartField";
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
  const { zoom, showAnimationPanel, drawnBbox, isDrawBboxMode } = useExploreSelector(
    s => s.map
  );
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
    bbox: drawnBbox,
    zoom: Math.round(zoom),
    render_params: renderOption?.options + `&collection=${collection?.id}`,
    cql,
  };

  const requestBody: AnimationConfig = { ...mosaicConfig, ...animationSettings };

  const {
    data: animationResp,
    isLoading,
    error,
    refetch: fetchAnimation,
    remove: removeAnimationResponse,
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
    removeAnimationResponse();
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
    dispatch(setDrawnBbox(null));
    removeAnimationResponse();
  };

  const validation = validate(requestBody, collection, layer, drawnBbox);
  const exportEnabled = !isLoading && validation.isValid;
  const drawExportEnabled = !isDrawBboxMode;

  const drawButtonText = drawnBbox ? "Re-draw export area" : "Draw export area";
  const drawButton = (
    <StackItem>
      <Text block>Start by selecting the area you want to capture on the map.</Text>
      <DefaultButton
        styles={buttonStyles}
        text={drawButtonText}
        iconProps={{ iconName: "SingleColumnEdit" }}
        onClick={() => {
          dispatch(setBboxDrawMode(true));
          removeAnimationResponse();
        }}
        disabled={!drawExportEnabled}
      />
    </StackItem>
  );

  const panel = (
    <Stack styles={containerStyles} tokens={panelTokens}>
      <AnimationIntro
        collection={collection}
        renderOption={renderOption}
        handleClose={handleClose}
      />
      {drawButton}
      <Stack
        horizontal
        horizontalAlign="start"
        tokens={stackTokens}
        verticalAlign={"start"}
      >
        <AnimationStartField
          collection={collection}
          defaultValue={animationSettings.start}
          validations={validation.start}
          onChange={handleChange}
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
        <AnimationError error={error as AxiosError<any, any>} />
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
export const stackTokens = { childrenGap: 6 };
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

export const firstInputStyle: Partial<ITextFieldStyles> = {
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
