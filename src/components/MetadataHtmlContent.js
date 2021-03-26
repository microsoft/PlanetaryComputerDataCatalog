import React from "react";
import {
  DefaultButton,
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

// HTML rendered Notebooks and Markdown files are fetched async from the static dir
const MetadataHtmlConent = ({ src, title, launch }) => {
  const { isSuccess, data } = useStaticMetadata(src);
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

  const metadata = isSuccess ? (
    <div>
      {title && <h3>{title}</h3>}
      <Stack horizontalAlign="end">
        <div>
          <Stack horizontal tokens={{ childrenGap: 10 }}>
            {ghLink}
            {launcher}
          </Stack>
        </div>
      </Stack>
      <div
        className="markdown-source"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data) }}
      ></div>
    </div>
  ) : (
    <Spinner
      styles={{ root: { marginTop: "275px" } }}
      size={SpinnerSize.large}
    />
  );

  return metadata;
};

export default MetadataHtmlConent;
