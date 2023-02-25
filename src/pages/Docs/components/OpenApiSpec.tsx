import React from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

interface OpenApiSpecProps {
  specUrl: string;
}

const OpenApiSpec: React.FC<OpenApiSpecProps> = ({ specUrl }) => {
  const postFix = () => {
    // Need to fix a select element without a label
    const el = document.getElementsByTagName("select")[0];
    if (el) {
      el.ariaLabel = "Select a server";
    }
  };

  return (
    <>
      <SwaggerUI url={specUrl} docExpansion="list" onComplete={postFix} />
    </>
  );
};

export default OpenApiSpec;
