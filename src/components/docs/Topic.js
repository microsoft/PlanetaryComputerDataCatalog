import React from "react";
import { Redirect, useParams } from "react-router-dom";
import GeneratedInternalToc from "./GeneratedInternalToc";

import RoutedHtml from "./RoutedHtml";

const Topic = ({ topics }) => {
  const { topicId, fileId } = useParams();
  const docsKey = `./${topicId}/${fileId}.json`;
  const doc = topics[docsKey];

  if (doc?.body) {
    const generatedToc = <GeneratedInternalToc html={doc.body} />;
    return (
      <div style={{ display: "flex", flexDirection: "row" }}>
        <RoutedHtml className="generated-docs" markup={doc.body}></RoutedHtml>
        {generatedToc}
      </div>
    );
  }
  return <Redirect to={"/404"} />;
};

export default Topic;
