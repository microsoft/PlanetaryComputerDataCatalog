import React from "react";
import { Text } from "@fluentui/react";

const NotFound = () => {
  return (
    <>
      <h1>404: Resource not found</h1>
      <Text block variant="large">
        Sorry, the item you requested could not be found.
      </Text>
    </>
  );
};

export default NotFound;
