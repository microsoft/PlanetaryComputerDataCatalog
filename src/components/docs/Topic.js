import { Separator } from "@fluentui/react";
import React from "react";
import { Redirect, useParams } from "react-router-dom";
import GeneratedInternalToc from "./GeneratedInternalToc";
import TopicNav from "./TopicNav";

import RoutedHtml from "./RoutedHtml";

const centerPanelWidth = "75%";

const Topic = ({ topics }) => {
  const { topicId, fileId } = useParams();
  const docsKey = `./${topicId}/${fileId}.json`;
  const doc = topics[docsKey];

  const bottomNav = (
    <TopicNav topic={topicId} prev={doc.prev} next={doc.next} />
  );

  if (doc?.body) {
    const generatedToc = <GeneratedInternalToc html={doc.body} />;
    return (
      <>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <RoutedHtml className="generated-docs" markup={doc.body}></RoutedHtml>
          {generatedToc}
        </div>
        <Separator styles={{ root: { width: centerPanelWidth } }} />
        {bottomNav}
      </>
    );
  }
  return <Redirect to={"/404"} />;
};

export default Topic;
