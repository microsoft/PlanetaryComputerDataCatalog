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
const MetadataHtmlConent = ({ src, launch }) => {
  const { isSuccess, isLoading, data } = useStaticMetadata(src);
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
