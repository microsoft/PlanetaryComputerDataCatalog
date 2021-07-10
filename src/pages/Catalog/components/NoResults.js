import { FontIcon, Link } from "@fluentui/react";
import { mergeStyles } from "@fluentui/react/lib/Styling";

const iconClass = mergeStyles({
  fontSize: 24,
  paddingRight: 15,
});

const NoResults = ({ typeText = "" }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        border: "1px solid #ccc",
        borderRadius: 3,
        padding: "0 15px",
        marginLeft: 50,
      }}
    >
      <FontIcon iconName="FabricFolderSearch" className={iconClass} />
      <div>
        <h3 style={{ marginBottom: 5 }}>No Results</h3>
        <p style={{ marginTop: 0 }}>
          {`No ${typeText} datasets matched your filter term. `} Looking for
          something in particular?{" "}
          <Link href="mailto:aiforearthdatasets@microsoft.com">
            Recommend a dataset
          </Link>{" "}
          to be included.
        </p>
      </div>
    </div>
  );
};

export default NoResults;
