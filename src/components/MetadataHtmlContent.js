import React from "react";
import {
  DefaultButton,
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize,
  Stack,
} from "@fluentui/react";

import { useStaticMetadata } from "../utils/requests";
import "../styles/codefiles.css";
import { a11yPostProcessDom, buildGitHubUrl } from "../utils";
import NewTabLink from "./controls/NewTabLink";
import GeneratedInternalToc from "../pages/Docs/components/GeneratedInternalToc";

// HTML rendered Notebooks and Markdown files are fetched async from the static dir
const MetadataHtmlContent = ({ src, launch }) => {
  const { isSuccess, isLoading, data } = useStaticMetadata(src);

  const ghLink = launch ? (
    <NewTabLink
      As={DefaultButton}
      href={buildGitHubUrl(launch)}
      title="Suggest edits to this document"
    >
      Edit
    </NewTabLink>
  ) : null;

  const loadingMsg = (
    <Spinner styles={{ root: { marginTop: "275px" } }} size={SpinnerSize.large} />
  );

  const errorMsg = (
    <MessageBar
      messageBarType={MessageBarType.error}
      isMultiline={false}
      styles={{ root: { marginTop: 20 } }}
    >
      Sorry, we're having trouble loading this content right now.
    </MessageBar>
  );

  // Load the markup fetched from the server. This was generated via nbconvert
  // and needs some preprocessing before it can be rendered
  const metadataDoc = new DOMParser().parseFromString(data, "text/html");
  let title = "";

  if (launch && isSuccess) {
    // Remove the title element so it can be placed in a React component header
    const titleEl = metadataDoc.querySelector("h2");
    title = titleEl?.innerText.replace("¶", "") || "";
    titleEl?.remove();
  }

  a11yPostProcessDom(metadataDoc);

  // Serialize the content back to a string so it can be injected
  const processedMarkup = new XMLSerializer().serializeToString(metadataDoc);

  const launchBar = launch ? (
    <>
      <h2 id={title.replace(/ /g, "-")}>{title}</h2>
      <Stack horizontalAlign="start">
        <div>
          <Stack horizontal tokens={{ childrenGap: 10 }}>
            {ghLink}
          </Stack>
        </div>
      </Stack>
    </>
  ) : null;

  const generatedToc = <GeneratedInternalToc nohash html={data} />;
  const metadata = isSuccess ? (
    <div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div>
          {launchBar}
          <div
            className="markdown-source"
            dangerouslySetInnerHTML={{
              __html: processedMarkup,
            }}
          ></div>
        </div>
        {generatedToc}
      </div>
    </div>
  ) : isLoading ? (
    loadingMsg
  ) : (
    errorMsg
  );

  return metadata;
};

export default MetadataHtmlContent;
