import React from "react";
import { Spinner, SpinnerSize } from "@fluentui/react";
import DOMPurify from "dompurify";

import { useStaticMetadata } from "../utils/requests";
import "../styles/codefiles.css";

// HTML rendered Notebooks and Markdown files are fetched async from the static dir
const MetadataHtmlConent = ({ src }) => {
  const { isSuccess, data } = useStaticMetadata(src);
  const metadata = isSuccess ? (
    <div
      className="markdown-source"
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data) }}
    ></div>
  ) : (
    <Spinner
      styles={{ root: { marginTop: "275px" } }}
      size={SpinnerSize.large}
    />
  );

  return metadata;
};

export default MetadataHtmlConent;
