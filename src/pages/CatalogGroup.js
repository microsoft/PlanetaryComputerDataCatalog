import { useState, useEffect } from "react";
import { useHistory, useLocation, useParams } from "react-router";
import { Pivot, PivotItem, Separator } from "@fluentui/react";
import marked from "marked";
import { isEmpty } from "lodash-es";

import GroupBanner from "../components/stac/GroupBanner";
import Layout from "../components/Layout";
import NotFound from "./NotFound";
import SEO from "../components/Seo";
import { useCollections } from "../utils/requests";

import groups from "../config/datasetGroups.yml";
import CollectionCard from "../components/stac/CollectionCard";
import { errorMsg, loadingMsg } from "../components/stac/CollectionLoaders";
import { capitalize, titleCase } from "../utils";

const ALL = "all";
const GROUP_ID = "msft:group_id";
const GROUP_KEYS = "msft:group_keys";

// Replace spaces with _ when using keys as tab keys
const keyFormatter = key => {
  return key.replace(/ /, "_");
};
const valFormatter = key => {
  return key.replace(/_/, " ");
};

const CatalogGroup = () => {
  const { groupId } = useParams();
  const history = useHistory();
  const location = useLocation();
  const [collections, setCollections] = useState([]);
  const [filteredCollections, setFilteredCollections] = useState([]);

  // Start out with "All" selected, unless a URL hash exists which would indicate the tab to activate
  const [selectedKey, setSelectedKey] = useState(
    location.hash.replace("#", "") || ALL
  );

  const group = groups[groupId];

  const { isError, isLoading, isSuccess, data: stacResponse } = useCollections();

  // When collections are loaded, filter down to the ones in the current group
  useEffect(() => {
    if (isSuccess) {
      const groupCollections = stacResponse.collections.filter(
        c => c[GROUP_ID] === groupId
      );

      if (groupCollections.length) {
        setCollections(groupCollections);
        setFilteredCollections(groupCollections);
      }
    }
  }, [groupId, stacResponse, isSuccess]);

  // When the pivot tab changes, use the key as a filter for grouped collections
  // which contain the selected key in their group_keys list
  useEffect(() => {
    const filtered =
      selectedKey === ALL
        ? collections
        : collections.filter(c =>
            c[GROUP_KEYS]?.includes(valFormatter(selectedKey))
          );

    // If the list was filtered down to nothing, this was probably a bad hash link. Just use all.
    setFilteredCollections(filtered.length ? filtered : collections);
  }, [collections, selectedKey]);

  const getCollectionCards = () =>
    filteredCollections.map(c => (
      <CollectionCard key={`card-${c.id}`} collection={c} />
    ));

  const datasets = isLoading
    ? loadingMsg
    : isError
    ? errorMsg
    : getCollectionCards();

  if (!group) {
    return <NotFound />;
  }

  const banner = <GroupBanner group={group} />;

  // Collections will have a list of group keys by which they can be filtered
  // down when on a catalog group page. Compute the list of keys with the number
  // of collections that are included.
  const groupedKeys = collections
    .map(c => c[GROUP_KEYS])
    .filter(k => !!k)
    .flat()
    .sort()
    .reduce((accum, groupKey) => {
      if (groupKey in accum) {
        accum[groupKey] += 1;
      } else {
        accum[groupKey] = 1;
      }
      return accum;
    }, {});

  // Turn the unique list of keys with counts into pivot item tabs
  const groupedItems = Object.entries(groupedKeys).map(([groupKey, count]) => {
    return (
      <PivotItem
        key={groupKey}
        itemKey={keyFormatter(groupKey)}
        headerText={titleCase(groupKey)}
        itemCount={count}
      />
    );
  });

  // Track the selected tab, i.e. filter key
  const handleLinkClick = pivotItem => {
    if (pivotItem) {
      const { itemKey } = pivotItem.props;
      setSelectedKey(itemKey);
      history.replace({ hash: itemKey });
    }
  };

  // Pivot table which contains only the header tabs. Clicking will apply a
  // group key filter to the list of collections in this group.
  const pivot = (
    <Pivot
      aria-label={`${group.title} filters`}
      headersOnly={true}
      selectedKey={selectedKey}
      onLinkClick={handleLinkClick}
    >
      <PivotItem
        headerText={capitalize(ALL)}
        itemKey={ALL}
        itemCount={collections.length}
      />
      {groupedItems}
    </Pivot>
  );

  return (
    <Layout bannerHeader={banner} isShort>
      <SEO title={group.title} description={null} />
      <section id="catalog-api-datasets">
        <div className="grid-content">
          <h2>Overview</h2>
          <p style={{ maxWidth: 800, marginBottom: 40 }}>
            <div
              dangerouslySetInnerHTML={{ __html: marked.parse(group.description) }}
            />
          </p>
          <div className="layout-container">
            {<Separator />}
            {!isEmpty(groupedKeys) && pivot}
            <div className="layout-row" style={{ marginTop: 20 }}>
              {datasets}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CatalogGroup;
