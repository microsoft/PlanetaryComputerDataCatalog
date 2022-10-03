import {
  DefaultButton,
  Dropdown,
  FontSizes,
  getTheme,
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
import { isEmpty } from "lodash-es";
import { SidebarPanels } from "pages/Explore/enums";

import {
  addAnimation,
  removeAnimation,
  selectAnimationFrameSettings,
  selectAnimationsByCollection,
  updateAnimationSettings,
} from "pages/Explore/state/animationSlice";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import {
  setBboxDrawMode,
  setDrawnShape,
  setSidebarPanel,
} from "pages/Explore/state/mapSlice";
import { selectCurrentMosaic } from "pages/Explore/state/mosaicSlice";
import { makeFilterBody, useCollectionMosaicInfo } from "pages/Explore/utils/hooks";
import { collectionFilter } from "pages/Explore/utils/stac";
import { useEffect } from "react";
import { useAnimationExport } from "utils/requests";
import { ImageResults } from "../BaseExporter";
import { ImageExportError } from "../BaseExporter/ImageExportError";
import { AnimationIntro } from "./AnimationIntro";
import { AnimationSettings } from "./AnimationSettings";
import { AnimationStartField } from "./AnimationStartField";
import { getDefaultSettings, validate } from "./helpers";
import { AnimationConfig, AnimationMosaicSettings } from "./types";

export const AnimationExporter: React.FC = () => {
  const dispatch = useExploreDispatch();
  const { collection, renderOption, query, layer } =
    useExploreSelector(selectCurrentMosaic);
  const { zoom, sidebarPanel, drawnShape, isDrawBboxMode } = useExploreSelector(
    s => s.map
  );
  const animations = useExploreSelector(s =>
    selectAnimationsByCollection(s, collection?.id)
  );
  const animationSettings = useExploreSelector(s =>
    selectAnimationFrameSettings(s, collection?.id)
  );
  const { data: mosaicInfo } = useCollectionMosaicInfo(collection?.id);

  const drawnBbox = drawnShape?.bbox || null;

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

  const frameSettings = isEmpty(animationSettings)
    ? getDefaultSettings(collection, mosaicInfo?.animationHint)
    : animationSettings;
  const requestBody: AnimationConfig = { ...mosaicConfig, ...frameSettings };

  const {
    data: animationResp,
    isLoading,
    error,
    refetch: fetchAnimation,
    remove: removeAnimationResponse,
  } = useAnimationExport(requestBody);

  // When an animation response is received, add it to the list of animations
  // for this collection and reset the payload state used to request it.
  useEffect(() => {
    if (
      animationResp &&
      collection &&
      !animations.find(a => a.url === animationResp.url)
    ) {
      dispatch(
        addAnimation({
          collectionId: collection.id,
          image: animationResp,
        })
      );
      removeAnimationResponse();
    }
  }, [animationResp, animations, collection, dispatch, removeAnimationResponse]);

  const handleExportClick = () => {
    fetchAnimation({ stale: true });
  };

  const handleChange = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string | undefined
  ) => {
    const fieldName = e.currentTarget.name;
    const value = parseInt(newValue || "0", 10);
    handleSettingsChange(fieldName, value);
  };

  const handleUnitChange = (_: any, option: IDropdownOption | undefined) =>
    handleSettingsChange("unit", option?.key as string);

  const handleSettingsChange = (
    key: string,
    value: string | number | boolean | undefined
  ) => {
    collection?.id &&
      dispatch(
        updateAnimationSettings({
          collectionId: collection?.id,
          animationSettings: {
            ...frameSettings,
            [key]: value,
          },
        })
      );
  };

  const handleClose = () => {
    dispatch(setSidebarPanel(SidebarPanels.itemSearch));
    dispatch(setDrawnShape(null));
    dispatch(setBboxDrawMode(false));
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
          value={frameSettings.start}
          validations={validation.start}
          onChange={handleSettingsChange}
        />
        <TextField
          type="number"
          name="step"
          label={"Increment"}
          min={1}
          step={1}
          defaultValue={frameSettings.step.toString()}
          onChange={handleChange}
          styles={inputStyles}
          errorMessage={validation.step[0]}
        />
        <Dropdown
          label="Unit"
          options={units}
          defaultSelectedKey={frameSettings.unit}
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
          defaultValue={frameSettings.frames.toString()}
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
          defaultValue={frameSettings.duration.toString()}
          styles={inputStyles}
          onChange={handleChange}
          errorMessage={validation.duration[0]}
        />
      </Stack>
      <StackItem shrink={false}>
        <Stack
          horizontal
          horizontalAlign="start"
          verticalAlign="center"
          tokens={stackTokens}
          styles={buttonStyles}
        >
          <PrimaryButton disabled={!exportEnabled} onClick={handleExportClick}>
            Generate animation
          </PrimaryButton>
          <AnimationSettings
            showProgressBar={frameSettings.showProgressBar}
            showBranding={frameSettings.showBranding}
            onSettingsChange={handleSettingsChange}
          />
        </Stack>

        {Boolean(validation.map.length) && (
          <Text block styles={errorTextStyles}>
            * {validation.map[0]}
          </Text>
        )}
        <ImageExportError error={error as AxiosError<any, any>} />
      </StackItem>

      {(animations.length || isLoading) && collection && (
        <ImageResults
          collectionId={collection.id}
          images={animations}
          isLoading={isLoading}
          onRemove={removeAnimation}
        />
      )}
    </Stack>
  );

  return sidebarPanel === SidebarPanels.animation ? panel : null;
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

const buttonStyles: Partial<IStackStyles> = {
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
