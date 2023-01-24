import { Text } from "@fluentui/react";
import { IMosaicRenderOption } from "pages/Explore/types";
import { IStacCollection } from "types/stac";
import { ExporterHeader } from "../BaseExporter/ExporterHeader";

interface Props {
  collection: IStacCollection | null;
  renderOption: IMosaicRenderOption | null;
  handleClose: () => void;
}
export const AnimationIntro: React.FC<Props> = ({
  collection,
  renderOption,
  handleClose,
}) => {
  if (!collection) return null;

  return (
    <ExporterHeader
      title="Timelapse Animation"
      subTitle={`${collection.title || collection.id}, ${renderOption?.name}`}
      onClose={handleClose}
    >
      <Text>Generate an animated image of this dataset over time. </Text>
      <Text>
        Keep in mind that many datasets have irregular temporal availability, varied
        cloud cover, or other changes which might affect the quality of your results.
        You may need to experiment to get a good result!
      </Text>
    </ExporterHeader>
  );
};
