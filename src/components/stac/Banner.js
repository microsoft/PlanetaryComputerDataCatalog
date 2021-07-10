import { Text } from "@fluentui/react";
import { Link } from "react-router-dom";

import Keywords from "./Keywords";
import { collections as collectionsConfig } from "../../config/datasets.yml";
import { useHistory } from "react-router";
import { titleCase } from "utils";

const Banner = ({ collection }) => {
  const history = useHistory();
  if (!collection) return null;

  const handleClick = keyword => {
    history.push({ pathname: "/catalog", search: `tags=${keyword}` });
  };

  const imgUrl =
    collectionsConfig[collection.id]?.headerImg ||
    collection.assets?.thumbnail?.href;

  const groupId = collection["msft:group_id"];
  const bannerBreadcrumbs = groupId ? (
    <>
      <Link to="/catalog">Datasets</Link> {" > "}
      <Link to={`/dataset/group/${groupId}`}>{titleCase(groupId)}</Link>
    </>
  ) : (
    <Link to="/catalog">Datasets</Link>
  );

  return (
    <div
      className="page-header"
      style={{
        backgroundImage: `url(${imgUrl})`,
      }}
    >
      <div className="grid-content">
        <Text
          block
          className="breadcrumbs"
          styles={{ root: { color: "#fff", fontWeight: 500, marginTop: 5 } }}
        >
          {bannerBreadcrumbs}
        </Text>
        <h1 style={{ color: "#fff" }}>{collection.title}</h1>
        <Keywords dark keywords={collection.keywords} onClick={handleClick} />
      </div>
      <div></div>
    </div>
  );
};

export default Banner;
