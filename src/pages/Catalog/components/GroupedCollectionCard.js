import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import AssetThumbnail from "components/stac/AssetThumbnail";
import Keywords from "components/stac/Keywords";

const GroupedCollectionCard = ({ group }) => {
  const navigate = useNavigate();
  if (!group) return null;

  const { assets, groupId, keywords, short_description, title } = group;
  const href = `/dataset/group/${group.groupId}`;

  return (
    <div className="api-datasource-item" key={groupId}>
      <Link to={href} aria-label={`Navigate to dataset group: ${groupId}`}>
        <AssetThumbnail assets={assets} />

        <h3>{title}</h3>
      </Link>
      <p style={{ color: "initial", minHeight: 50 }}>{short_description}</p>
      <Keywords
        keywords={keywords}
        color="#4C4C51"
        onClick={keyword => {
          navigate({ search: `tags=${keyword}` });
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </div>
  );
};

export default GroupedCollectionCard;
