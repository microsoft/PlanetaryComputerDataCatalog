import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useQueryString } from "../utils/hooks";
import { useCollections } from "../utils/requests";
import SEO from "../components/Seo";
import { updateUrl } from "../features/catalog/catalogSlice";
import Layout from "../components/Layout";

const Datasets = () => {
  const qs = useQueryString();
  const dispatch = useDispatch();
  const catalogUrl = qs.get("catalog");

  useEffect(() => {
    if (catalogUrl) {
      dispatch(updateUrl(catalogUrl));
    }
  });

  const { isLoading, data: collections } = useCollections();

  const links = (
    <ul>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        collections.map(collection => {
          return (
            <li key={collection.id}>
              <Link to={`collection/${collection.id}`}>{collection.title}</Link>
            </li>
          );
        })
      )}
    </ul>
  );
  return (
    <Layout>
      <SEO title="Datasets" />
      <h2>Datasets</h2>
      <section>{links}</section>

      <h3>Other datasets</h3>
    </Layout>
  );
};

export default Datasets;
