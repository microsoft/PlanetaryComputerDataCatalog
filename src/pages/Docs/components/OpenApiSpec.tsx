import React from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

interface OpenApiSpecProps {
  specUrl: string;
}

const OpenApiSpec: React.FC<OpenApiSpecProps> = ({ specUrl }) => {
  return (
    <>
      <SwaggerUI url={specUrl} docExpansion="list" />
    </>
  );
};

export default OpenApiSpec;
