import { Link } from "react-router-dom";
import { Text } from "@fluentui/react";

const GroupBanner = ({ group }) => {
  if (!group) return null;

  return (
    <div
      className="page-header"
      style={{
        backgroundImage: `url(${group.assets.headerImg.href})`,
      }}
    >
      <div className="grid-content">
        <Text
          block
          className="breadcrumbs"
          styles={{ root: { color: "#fff", fontWeight: 500, marginTop: 5 } }}
        >
          <Link style={linkStyles} to="/catalog">
            Datasets
          </Link>
        </Text>
        <h1 style={{ color: "#fff" }}>{group.title}</h1>
      </div>
      <div></div>
    </div>
  );
};

export default GroupBanner;

const linkStyles = {
  textDecoration: "none",
};
