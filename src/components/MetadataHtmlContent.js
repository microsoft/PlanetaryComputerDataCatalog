import React, { useEffect, useRef } from "react";
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
const MetadataHtmlConent = ({ src, launch }) => {
  const { isSuccess, isLoading, data } = useStaticMetadata(src);
  const contentRef = useRef();

  useEffect(() => {
    // TODO: Unify with copy in RoutedHtml. Note in this implementation,
    // the dependency array is empty so it applies on every render, due
    // to the tab changes.

    // Keyboard users needs a tabindex set on scrollable content if they
    // otherwise do not have focusable content. These python codeblocks are
    // brought over from nbconvert and must have a tabindex set to all keyboard
    // scrolling.
    if (contentRef.current) {
      contentRef.current
        .querySelectorAll(".highlight.hl-ipython3 pre")
        .forEach(element => {
          element.setAttribute("tabindex", 0);
        });

      // Add an alt text for any images that don't otherwise have it
      contentRef.current
        .querySelectorAll(".output_png img")
        .forEach(element => {
          if (!element.getAttribute("alt")) {
            element.setAttribute(
              "alt",
              "Rendered output from previous code snippet"
            );
          }
        });
    }
  });

  const ghLink = launch ? (
    <NewTabLink As={DefaultButton} href={buildGitHubUrl(launch)}>
      Edit on GitHub
    </NewTabLink>
  ) : null;

  const launcher = launch ? (
    <NewTabLink As={PrimaryButton} href={buildHubLaunchUrl(launch)}>
      {launch.title}
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

  const generatedToc = <GeneratedInternalToc nohash html={data} />;
  const metadata = isSuccess ? (
    <div>
      <Stack horizontalAlign="end">
        <div>
          <Stack horizontal tokens={{ childrenGap: 10 }}>
            {ghLink}
            {launcher}
          </Stack>
        </div>
      </Stack>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div
          ref={contentRef}
          className="markdown-source"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data) }}
        ></div>
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

export default MetadataHtmlConent;
