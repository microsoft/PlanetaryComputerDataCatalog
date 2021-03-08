import React from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

import { getCollections } from "../utils/requests";
import SEO from "../components/Seo";

const Home = () => {
  const query = useQuery("stac", getCollections);

  const links = (
    <ul>
      {query.isLoading ? (
        <div>Loading...</div>
      ) : (
        query.data.links
          .filter((l) => l.rel === "child")
          .map((c) => {
            return (
              <li key={c.href}>
                <Link
                  to={{
                    pathname: `/collection/${c.href.split("/").pop()}`,
                    state: { href: c.href },
                  }}
                >
                  {c.title}
                </Link>
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
