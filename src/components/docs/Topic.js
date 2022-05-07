import { Separator } from "@fluentui/react";
import { Navigate, useParams } from "react-router-dom";
import GeneratedInternalToc from "./GeneratedInternalToc";
import TopicNav from "./TopicNav";

import DocsHtmlContent from "./DocsHtmlContent";
import { useEffect } from "react";
import { scrollToHash } from "utils";

const centerPanelWidth = "75%";

const Topic = ({ topics }) => {
  const { topicId, fileId } = useParams();
  const docsKey = `./${topicId}/${fileId}.json`;
  const doc = topics[docsKey];

  useEffect(() => {
    scrollToHash(window.location.hash);
  });

  const bottomNav = <TopicNav topic={topicId} prev={doc.prev} next={doc.next} />;

  if (doc?.body) {
    const generatedToc = <GeneratedInternalToc html={doc.body} />;
    return (
      <>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <DocsHtmlContent
            className="generated-docs markdown-source"
            markupJson={doc}
          />
          {generatedToc}
        </div>
        <Separator styles={{ root: { width: centerPanelWidth } }} />
        {bottomNav}
      </>
    );
  }
  return <Navigate replace to={"/404"} />;
};

export default Topic;
