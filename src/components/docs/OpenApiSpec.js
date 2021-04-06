import React from "react";
import { RedocStandalone } from "redoc";

const OpenApiSpec = () => {
  return (
    <>
      <h2>API Reference</h2>
      <RedocStandalone
        specUrl={`${process.env.REACT_APP_MQE_URL}/openapi.json`}
        options={{
          hideDownloadButton: true,
          theme: {
            breakpoints: { small: "1000px", medium: "1700px", large: "2000px" },
          },
        }}
      />
    </>
  );
};

export default OpenApiSpec;
