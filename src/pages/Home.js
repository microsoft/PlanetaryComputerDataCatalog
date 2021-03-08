import React from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

import { getCollections } from "../utils/requests";
import SEO from "../components/Seo";

const Home = () => {
  const { isLoading, data: collections } = useQuery("stac", getCollections);

  const links = (
    <ul>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        collections.map((collection) => {
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
    <div>
      <SEO title="Home" />
      <h2>Home</h2>
      <section>{links}</section>
    </div>
  );
};

export default Home;
