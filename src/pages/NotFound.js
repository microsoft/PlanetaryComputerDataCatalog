import React from "react";
import { Text } from "@fluentui/react";
import Layout from "../components/Layout";

const NotFound = () => {
  return (
    <Layout isShort>
      <h1>404: Resource not found</h1>
      <Text block variant="large">
        Sorry, the item you requested could not be found.
      </Text>
    </Layout>
  );
};

export default NotFound;
