import { Separator } from "@fluentui/react";
import { Navigate, useParams } from "react-router-dom";
import GeneratedInternalToc from "./GeneratedInternalToc";
import TopicNav from "./TopicNav";

import DocsHtmlContent from "./DocsHtmlContent";
import { useEffect } from "react";
import { scrollToHash } from "utils";

interface TopicProps {
  topics: { [key: string]: any };
}
const Topic: React.FC<TopicProps> = ({ topics }) => {
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
        <div style={bodyStyle}>
          <DocsHtmlContent
            idText="generated-docs-content"
            className="generated-docs markdown-source"
            markupJson={doc}
          />
          {generatedToc}
        </div>
        <Separator styles={separatorStyles} />
        {bottomNav}
      </>
    );
  }
  return <Navigate replace to={"/404"} />;
};

export default Topic;

const separatorStyles = { root: { width: "75%" } };
const bodyStyle: React.CSSProperties = { display: "flex", flexDirection: "row" };
