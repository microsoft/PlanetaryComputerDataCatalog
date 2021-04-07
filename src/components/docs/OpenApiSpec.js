import React from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const OpenApiSpec = ({ title, specUrl }) => {
  return (
    <>
      <h2>{title}</h2>
      <SwaggerUI url={specUrl} docExpansion="list" />
    </>
  );
};

export default OpenApiSpec;
