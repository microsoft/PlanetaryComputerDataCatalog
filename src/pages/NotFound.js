import React from "react";
import { Text } from "@fluentui/react";
import Layout from "../components/Layout";

const NotFound = () => {
  return (
    <Layout isShort>
      <div className="grid-content">
        <h1>404: Resource not found</h1>
        <Text block variant="large">
          Sorry, the item you requested could not be found.
        </Text>
      </div>
    </Layout>
  );
};

export default NotFound;
