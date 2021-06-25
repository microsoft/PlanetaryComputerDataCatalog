import { Text } from "@fluentui/react";
import ChevronLink from "components/controls/ChevronLink";
import NewTabLink from "components/controls/NewTabLink";

const DatasetCard = ({ resourceItem }) => {
  const { alt, title, shortTerm, thumbnailUrl, description, infoUrl } = resourceItem;

  const linkLabel = shortTerm || title;
  const thumbnailHref = `https://ai4edatasetspublicassets.blob.core.windows.net/assets/pc_thumbnails/additional_datasets/${thumbnailUrl}`;

  return (
    <div className="add-datasource-item">
      <NewTabLink href={infoUrl} style={{ textDecoration: "none" }}>
        <div className="responsive-container-wide">
          <img alt={alt || `Screenshot of ${title}`} src={thumbnailHref} />
        </div>
        <h3 style={{ marginBottom: 2, color: "initial" }}>{title}</h3>
        <Text block variant="medium" style={{ marginBottom: 10, minHeight: 37 }}>
          {description}
        </Text>
      </NewTabLink>
      <ChevronLink href={infoUrl} label={`Get ${linkLabel} data `} />
    </div>
  );
};

export default DatasetCard;
