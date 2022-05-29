import { SearchBox } from "@fluentui/react";

interface CatalogFilterProps {
  filterText: string | undefined;
  onFilterChange: (_: any, newValue?: string | undefined) => void;
}
export const CatalogFilter: React.FC<CatalogFilterProps> = ({
  filterText,
  onFilterChange,
}) => {
  return (
    <SearchBox
      placeholder="Filter datasets"
      value={filterText}
      onChange={onFilterChange}
      data-cy="catalog-filter-input"
    />
  );
};
