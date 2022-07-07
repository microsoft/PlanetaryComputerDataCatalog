import { FontIcon, Link } from "@fluentui/react";
import { mergeStyles } from "@fluentui/react/lib/Styling";

const iconClass = mergeStyles({
  fontSize: 24,
  paddingRight: 15,
});

interface NoResultsProps {
  typeText?: string;
}

export const NoResults: React.FC<NoResultsProps> = ({ typeText = "" }) => {
  return (
    <div data-cy="no-filtered-collection-results" style={bodyStyle}>
      <FontIcon iconName="FabricFolderSearch" className={iconClass} />
      <div>
        <h3 style={headerStyle}>No Results</h3>
        <p style={contentStyle}>
          {`No ${typeText} datasets matched your filter term. `}
          Looking for something in particular?{" "}
          <Link href="https://github.com/microsoft/PlanetaryComputer/discussions/categories/data-request">
            Recommend a dataset
          </Link>{" "}
          to be included.
        </p>
      </div>
    </div>
  );
};

const bodyStyle = {
  display: "flex",
  alignItems: "center",
  border: "1px solid #ccc",
  borderRadius: 3,
  padding: "0 15px",
  margin: 20,
};

const headerStyle = { marginBottom: 5 };
const contentStyle = { marginTop: 0 };
