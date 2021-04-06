import React from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const OpenApiSpec = () => {
  return (
    <>
      <h2>API Reference</h2>
      <SwaggerUI url={`${process.env.REACT_APP_MQE_URL}/openapi.json`} />
    </>
  );
};

export default OpenApiSpec;
