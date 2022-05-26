import { SearchBox } from "@fluentui/react";

interface CatalogFilterProps {
  onFilterChange: (_: any, newValue?: string | undefined) => void;
  filterText: string | undefined;
}
export const CatalogFilter: React.FC<CatalogFilterProps> = ({
  onFilterChange,
  filterText,
}) => {
  return (
    <SearchBox
      placeholder="Filter datasets"
      value={filterText}
      onChange={onFilterChange}
    />
  );
};
