import React from "react";
import { useHistory } from "react-router-dom";
import DOMPurify from "dompurify";

const anchorRegex = /class="reference internal" href="/gi;
const imagePathRegex = /..\/..\/_images/gi;

// Given a string of HTML markup generated from sphinx-build, rewrite
// internal links and capture their events to process them through the
// React Router system.
const RoutedHtml = ({ className, markup, children }) => {
  const history = useHistory();

  const handleClick = e => {
    if (e.target.getAttribute("class")?.includes("reference internal")) {
      const path = e.target.getAttribute("href");
      e.preventDefault();
      history.push(path);
    }
  };

  const content = markup ? (
    <div className={className}>
      {children}
      <div
        onClick={handleClick}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(
            markup
              .replace(anchorRegex, 'class="reference internal" href="/docs/')
              .replace(imagePathRegex, `${process.env.PUBLIC_URL}/_images`)
          ),
        }}
      />
    </div>
  ) : null;

  return content;
};

export default RoutedHtml;
