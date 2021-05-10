import React from "react";
import {
  DefaultButton,
  MessageBar,
  MessageBarType,
  PrimaryButton,
  Spinner,
  SpinnerSize,
  Stack,
} from "@fluentui/react";
import DOMPurify from "dompurify";

import { useStaticMetadata } from "../utils/requests";
import "../styles/codefiles.css";
import { buildGitHubUrl, buildHubLaunchUrl } from "../utils";
import NewTabLink from "./controls/NewTabLink";
import GeneratedInternalToc from "./docs/GeneratedInternalToc";

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

  const launcher = launch ? (
    <NewTabLink
      As={PrimaryButton}
      href={buildHubLaunchUrl(launch)}
      title="This example can be launched in the Planetary Computer Hub"
    >
      Launch in Hub
    </NewTabLink>
  ) : null;

  const loadingMsg = (
    <Spinner
      styles={{ root: { marginTop: "275px" } }}
      size={SpinnerSize.large}
    />
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
    title = titleEl?.innerText.replace("¶", "");
    titleEl?.remove();
  }

  // Keyboard users needs a tabindex set on scrollable content if they
  // otherwise do not have focusable content. These python codeblocks are
  // brought over from nbconvert and must have a tabindex set to all keyboard
  // scrolling.
  metadataDoc
    .querySelectorAll(".highlight.hl-ipython3 pre")
    .forEach(element => {
      element.setAttribute("tabindex", 0);
    });

  // Images need an alt text property if one wasn't provided in the source doc
  metadataDoc.querySelectorAll(".output_png img").forEach(element => {
    if (!element.getAttribute("alt")) {
      element.setAttribute("alt", "Rendered output from previous code snippet");
    }
  });

  // Serialize the content back to a string so it can be injected
  const processedMarkup = new XMLSerializer().serializeToString(metadataDoc);

  const launchBar = launch ? (
    <>
      <h2 id={title.replace(/ /g, "-")}>{title}</h2>
      <Stack horizontalAlign="start">
        <div>
          <Stack horizontal tokens={{ childrenGap: 10 }}>
            {launcher}
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
              __html: DOMPurify.sanitize(processedMarkup),
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
