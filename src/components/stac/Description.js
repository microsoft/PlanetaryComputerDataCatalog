import React from "react";
import marked from "marked";
import DOMPurify from "dompurify";

const Description = ({ collection }) => {
  return (
    <div
      className="collection-content-item"
      // style={{ marginTop: "5px", marginBottom: "5px" }}
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(marked(collection.description)),
      }}
    ></div>
  );
};
export default Description;
