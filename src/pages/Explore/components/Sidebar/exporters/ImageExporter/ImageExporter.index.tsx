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

import {
  addImage,
  selectImageSettings,
  selectImagesByCollection,
  updateImageSettings,
  removeImage,
} from "pages/Explore/state/imageSlice";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import {
  setBboxDrawMode,
  setDrawnShape,
  setShowSidebar,
  setSidebarPanel,
} from "pages/Explore/state/mapSlice";
import { selectCurrentMosaic } from "pages/Explore/state/mosaicSlice";
import { makeFilterBody } from "pages/Explore/utils/hooks";
import { collectionFilter } from "pages/Explore/utils/stac";
import { useImageExport } from "utils/requests";
import { ImageExportError } from "../BaseExporter/ImageExportError";
import { ImageIntro } from "./ImageIntro";
import { ImageResults } from "../BaseExporter/ImageResults";
import { ImageSettings } from "./ImageSettings";
import { validate, getDefaultImageSettings } from "./helpers";
import { ImageConfig, ImageMosaicSettings } from "./types";
import { SidebarPanels } from "pages/Explore/enums";
import { useEffect } from "react";
import { useMedia } from "react-use";
import { MOBILE_WIDTH } from "utils/constants";
import { sidebarPanelStyles } from "../AnimationExporter/AnimationExporter.index";

export const ImageExporter: React.FC = () => {
  const dispatch = useExploreDispatch();
  const { collection, renderOption, query, layer } =
    useExploreSelector(selectCurrentMosaic);
  const { zoom, sidebarPanel, drawnShape, isDrawBboxMode } = useExploreSelector(
    s => s.map
  );
  const images = useExploreSelector(s =>
    selectImagesByCollection(s, collection?.id)
  );
  let imageSettings = useExploreSelector(s =>
    selectImageSettings(s, collection?.id)
  );
  const isMobileView = useMedia(`(max-width: ${MOBILE_WIDTH}px)`);

  if (isEmpty(imageSettings)) {
    imageSettings = getDefaultImageSettings();
  }

  // Build up the config payload to be used to request an Image
  // based on the current map/filter state.
  const collectionFragment = collectionFilter(collection?.id);
  const cql = makeFilterBody([collectionFragment], query, query.cql);
  const mosaicConfig: ImageMosaicSettings = {
    geometry: drawnShape?.geometry || null,
    zoom: Math.round(zoom),
    render_params: renderOption?.options + `&collection=${collection?.id}`,
    cql,
  };

  const requestBody: ImageConfig = { ...mosaicConfig, ...imageSettings };

  const {
    data: ImageResp,
    isLoading,
    error,
    refetch: fetchImage,
    remove: removeImageResponse,
  } = useImageExport(requestBody);

  useEffect(() => {
    // When an Image response is received, add it to the list of Images
    // for this collection and reset the payload state used to request it.
    if (ImageResp && collection && !images.find(a => a.url === ImageResp.url)) {
      dispatch(
        addImage({
          collectionId: collection.id,
          image: ImageResp,
        })
      );
      removeImageResponse();
    }
  }, [ImageResp, collection, dispatch, images, removeImageResponse]);

  const handleExportClick = () => {
    fetchImage({ stale: true });
  };

  const handleChange = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string | undefined
  ) => {
    const fieldName = e.currentTarget.name;
    const value = parseInt(newValue || "0", 10);
    handleSettingsChange(fieldName, value);
  };

  const handleImageSizeChange = (_: any, option: IDropdownOption | undefined) => {
    const v = option?.key as string;
    let cols = imageSettings.cols;
    let rows = imageSettings.rows;
    if (v && v !== "custom") {
      const dims = v.split("x").map((v, i) => parseInt(v));
      cols = dims[0];
      rows = dims[1];
    }
    collection?.id &&
      dispatch(
        updateImageSettings({
          collectionId: collection?.id,
          imageSettings: {
            ...imageSettings,
            imageSize: v,
            cols: cols,
            rows: rows,
          },
        })
      );
  };

  const handleSettingsChange = (
    key: string,
    value: string | number | boolean | undefined
  ) => {
    collection?.id &&
      dispatch(
        updateImageSettings({
          collectionId: collection?.id,
          imageSettings: {
            ...imageSettings,
            [key]: value,
          },
        })
      );
  };

  const handleClose = () => {
    dispatch(setSidebarPanel(SidebarPanels.itemSearch));
    dispatch(setDrawnShape(null));
    dispatch(setBboxDrawMode(false));
    removeImageResponse();
  };

  const validation = validate(requestBody, layer, drawnShape);
  const exportEnabled = !isLoading && validation.isValid;
  const drawExportEnabled = !isDrawBboxMode;
  const customImageSize = imageSettings?.imageSize === "custom";

  const drawButtonText = drawnShape ? "Re-draw export area" : "Draw export area";
  const drawButton = (
    <StackItem>
      <Text block>Start by selecting the area you want to capture on the map.</Text>
      <DefaultButton
        styles={buttonStyles}
        text={drawButtonText}
        iconProps={{ iconName: "SingleColumnEdit" }}
        onClick={() => {
          dispatch(setBboxDrawMode(true));
          isMobileView && dispatch(setShowSidebar(false));
          removeImageResponse();
        }}
        disabled={!drawExportEnabled}
      />
    </StackItem>
  );

  const panel = (
    <Stack styles={sidebarPanelStyles} tokens={panelTokens}>
      <ImageIntro
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
        <Dropdown
          label="Image Size"
          options={imageSizes}
          defaultSelectedKey={imageSettings.imageSize}
          onChange={handleImageSizeChange}
          styles={dimensionsStyles}
        />
      </Stack>
      {customImageSize && (
        <Stack horizontal horizontalAlign="start" tokens={stackTokens}>
          <TextField
            type="number"
            label="Width (px)"
            name="cols"
            min={2}
            max={48}
            step={1}
            defaultValue={imageSettings.cols.toString()}
            onChange={handleChange}
            styles={inputStyles}
            errorMessage={validation.frames[0]}
          />
          <TextField
            type="number"
            label="Height (px)"
            name="rows"
            min={1}
            step={1}
            defaultValue={imageSettings.rows.toString()}
            styles={inputStyles}
            onChange={handleChange}
            errorMessage={validation.duration[0]}
          />
        </Stack>
      )}
      <StackItem shrink={false}>
        <Stack
          horizontal
          horizontalAlign="start"
          verticalAlign="center"
          tokens={stackTokens}
          styles={buttonStyles}
        >
          <PrimaryButton disabled={!exportEnabled} onClick={handleExportClick}>
            Generate Image
          </PrimaryButton>
          <ImageSettings
            showBranding={imageSettings.showBranding}
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

      {(images.length || isLoading) && collection && (
        <ImageResults
          collectionId={collection.id}
          images={images}
          isLoading={isLoading}
          onRemove={removeImage}
        />
      )}
    </Stack>
  );

  return sidebarPanel === SidebarPanels.image ? panel : null;
};

const theme = getTheme();
export const stackTokens = { childrenGap: 6 };
const panelTokens = { childrenGap: 10 };

const imageSizes: IDropdownOption[] = [
  {
    key: "1920x1080",
    text: "Large (1920 x 1080)",
    title: "Use to generate a Teams background",
  },
  {
    key: "1280x720",
    text: "Medium (1280 x 720)",
    title: "Medium sized image with 16:9 aspect ratio",
  },
  {
    key: "1080x1080",
    text: "Square (1080 x 1080)",
    title: "Use for social media posts",
  },
  { key: "custom", text: "Custom", title: "Enter image size manually" },
];

const inputStyles: Partial<ITextFieldStyles> = {
  root: {
    width: 136,
  },
};

const dimensionsStyles: Partial<IDropdownStyles> = {
  root: {
    width: 190,
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
