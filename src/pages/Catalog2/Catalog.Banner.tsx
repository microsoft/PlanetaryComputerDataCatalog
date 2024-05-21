import { IStackTokens, ITextStyles, Stack, Text } from "@fluentui/react";
import DefaultBanner from "components/DefaultBanner";
import { CatalogFilter } from "./Catalog.Filter";

interface CatalogBannerProps {
  onFilterChange: (_: any, newValue?: string | undefined) => void;
  filterText: string | undefined;
}

export const CatalogBanner: React.FC<CatalogBannerProps> = ({
  filterText,
  onFilterChange,
}) => {
  return (
    <DefaultBanner>
      <h1>Data Catalog</h1>
      <Stack tokens={bannerTokens}>
        <Text block as={"p"} styles={blurbStyles}>
          The Planetary Computer Data Catalog includes petabytes of environmental
          monitoring data, in consistent, analysis-ready formats. All of the datasets
          below can be accessed via Azure Blob Storage.
        </Text>
        <CatalogFilter filterText={filterText} onFilterChange={onFilterChange} />
      </Stack>
    </DefaultBanner>
  );
};

const bannerTokens: IStackTokens = {
  childrenGap: 20,
};

const blurbStyles: ITextStyles = {
  root: {
    fontWeight: 500,
  },
};
