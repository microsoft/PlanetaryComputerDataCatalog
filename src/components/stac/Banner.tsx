import { Text } from "@fluentui/react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";

import Keywords from "./Keywords";
import { collections as collectionsConfig } from "config/datasets.yml";
import groups from "config/datasetGroups.yml";
import { IPcCollection } from "types/stac";

interface BannerProps {
  collection: IPcCollection;
  forceGradient?: boolean;
}
const Banner: React.FC<BannerProps> = ({ collection, forceGradient = false }) => {
  const navigate = useNavigate();
  if (!collection) return null;

  const handleClick = (keyword: string) => {
    navigate({ pathname: "/catalog", search: `filter=${keyword}` });
  };

  const imgUrl =
    collectionsConfig[collection.id]?.headerImg ||
    collection.assets?.thumbnail?.href;

  const groupId = collection["msft:group_id"];
  const hasGroup = groupId && groups[groupId];

  const bannerBreadcrumbs = hasGroup ? (
    <>
      <Link to="/catalog">Datasets</Link> {" > "}
      <Link to={`/dataset/group/${groupId}`}>{groups[groupId].title}</Link>
    </>
  ) : (
    <Link to="/catalog">Datasets</Link>
  );

  const gradientStyle = forceGradient ? linearGradient : undefined;

  return (
    <div
      className="page-header"
      style={{
        backgroundImage: `url(${imgUrl})`,
      }}
    >
      <div className="page-header--gradient" style={gradientStyle}>
        <div className="grid-content">
          <Text
            block
            className="breadcrumbs"
            styles={{ root: { color: "#fff", fontWeight: 500, marginTop: 5 } }}
          >
            {bannerBreadcrumbs}
          </Text>
          <h1 style={{ color: "#fff" }}>{collection.title}</h1>
          <Keywords
            dark
            keywords={collection.keywords}
            maxDisplayed={8}
            onClick={handleClick}
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;

const linearGradient: React.CSSProperties = {
  background: "linear-gradient(90deg, rgb(76 68 68 / 68%), 33%, transparent)",
};
