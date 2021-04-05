import React from "react";
import { Redirect, useParams } from "react-router-dom";

import RoutedHtml from "./RoutedHtml";

const Topic = ({ topics }) => {
  const { topicId, fileId } = useParams();
  const docsKey = `./${topicId}/${fileId}.json`;
  const doc = topics[docsKey];

  if (doc?.body) {
    return <RoutedHtml className="generated-docs" markup={doc.body} />;
  }
  return <Redirect to={"/404"} />;
};

export default Topic;
