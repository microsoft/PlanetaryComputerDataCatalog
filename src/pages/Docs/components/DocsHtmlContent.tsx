import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { a11yPostProcessDom } from "../../../utils";

// Given a Json object of HTML markup generated from sphinx-build, rewrite
// internal links and capture their events to process them through the
// React Router system.
interface DocsHtmlContentProps {
  className: string;
  markupJson: any;
}

const DocsHtmlContent: React.FC<DocsHtmlContentProps> = ({
  className,
  markupJson,
  children,
}) => {
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);

  const { body, current_page_name } = markupJson;

  // Sphinx generates internal links at a depth that doesn't align with the
  // app routing structure. Rewrite link paths so they resolve within the app.
  // Note: currently assumes only child directories at a depth of 1 from root (/docs)
  const pathParts = current_page_name.split("/");
  const pwd = pathParts.length > 1 ? pathParts[0] : "";

  // Links that point to directories that share a parent with the current doc (../../)
  const anchorPeerRegex = /class="reference internal" href="..\/..\//gi;
  const anchorPeerReplace = 'class="reference internal" href="/docs/';

  // Links that point to a file in the current directory (../)
  const anchorSiblingRegex = /class="reference internal" href="..\//gi;
  const anchorSiblingReplace = `class="reference internal" href="/docs/${pwd}/`;

  // Links which treat a sub directory as root, and need to be a child of docs/
  const anchorRootRegex = /class="reference internal" href="/gi;
  const anchorRootReplace = `class="reference internal" href="/docs/`;

  const imagePathRegex = /..\/..\/_images/gi;

  // Load the markup fetched from the server. This was generated via nbconvert
  // and needs some preprocessing before it can be rendered
  const docsDoc = new DOMParser().parseFromString(body, "text/html");

  // Move the Hub launcher buttons under the main header so it matches their
  // placement in non-Sphinx generate documents
  const launcherEl = docsDoc.querySelector(".docs-launcher");

  if (launcherEl) {
    docsDoc.querySelector("h1")?.insertAdjacentElement("afterend", launcherEl);
  }

  a11yPostProcessDom(docsDoc);

  // Serialize the content back to a string so it can be injected
  const processedMarkup = new XMLSerializer().serializeToString(docsDoc);

  // Handle any internal links as an SPA style route, not a full reload.
  // If the href includes 1-4 characters after a `.`, treat as file extension
  // and allow a direct download.
  const handleClick = (e: React.MouseEvent<HTMLDivElement> | undefined) => {
    if (!e) return;
    const target = e.target as HTMLDivElement;
    const anchor = target.closest("a.reference.internal") as HTMLAnchorElement;
    if (anchor && !anchor.href.match(/\.[a-z]{1,4}$/i)) {
      const path = anchor.getAttribute("href");
      e.preventDefault();
      path && navigate(path);
    }
  };

  // Replace any sibling links (shares a parent dir) with /docs/
  let bodyWithRoutedLinks = processedMarkup.replace(
    anchorPeerRegex,
    anchorPeerReplace
  );

  // If the current doc is not at root, replace peer links (in the same dir)
  // with /docs/{pwd}/
  if (pwd) {
    bodyWithRoutedLinks = bodyWithRoutedLinks.replace(
      anchorSiblingRegex,
      anchorSiblingReplace
    );
  }

  // If the current doc is at root, replace links so they start with /docs/
  if (!pwd) {
    bodyWithRoutedLinks = bodyWithRoutedLinks.replace(
      anchorRootRegex,
      anchorRootReplace
    );
  }

  bodyWithRoutedLinks = bodyWithRoutedLinks.replace(
    imagePathRegex,
    `${process.env.PUBLIC_URL}/_images`
  );

  // Allow sanitization to safely set new tab targets. This could occur
  // when Sphinx generated content has a target attribute set which is
  // stripped out by the sanitizer.
  DOMPurify.addHook("afterSanitizeAttributes", node => {
    if (node.getAttribute("rel") === "noopener noreferrer") {
      node.setAttribute("target", "_blank");
    }
  });

  const html = allowList.includes(current_page_name)
    ? bodyWithRoutedLinks
    : DOMPurify.sanitize(bodyWithRoutedLinks);

  const content = processedMarkup ? (
    <div className={className}>
      {children}
      <div
        ref={contentRef}
        onClick={handleClick}
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />
    </div>
  ) : null;

  return content;
};

export default DocsHtmlContent;

// Skip dom sanitizations for pages that embed scripts
const allowList = ["quickstarts/using-the-data-api"];
