import { Text } from "@fluentui/react";
import { IMosaicRenderOption } from "pages/Explore/types";
import { IStacCollection } from "types/stac";
import { ExporterHeader } from "../BaseExporter/ImageIntro";

interface Props {
  collection: IStacCollection | null;
  renderOption: IMosaicRenderOption | null;
  handleClose: () => void;
}
export const ImageIntro: React.FC<Props> = ({
  collection,
  renderOption,
  handleClose,
}) => {
  if (!collection) return null;

  return (
    <ExporterHeader
      title="Image Export"
      subTitle={`${collection.title || collection.id}, ${renderOption?.name}`}
      onClose={handleClose}
    >
      <Text>Generate an image of this dataset. </Text>
      <Text>
        The image will be generated using the current search. Draw a bounding box for
        the image and select the image size. The image returned will be at the size
        provided and will contain the area drawn in the bounding box. Note that the
        image bounds may be larger than the drawn area.
      </Text>
      <Text>Click on the generated image to download or share.</Text>
    </ExporterHeader>
  );
};
