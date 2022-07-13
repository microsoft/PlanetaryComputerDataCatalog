import { Link } from "@fluentui/react";
import React, { useEffect, useState } from "react";
import { HashLink } from "react-router-hash-link";
import { scrollToHash } from "../../../utils";

// nohash: don't use the URL hash, as it may already be in use (ie, tabs).
//         Instead, just handle scrolling via click handler
interface GeneratedInternalTocProps {
  nohash?: boolean;
  html: string;
}

const GeneratedInternalToc: React.FC<GeneratedInternalTocProps> = ({
  nohash = false,
  html,
}) => {
  const [headings, setHeadings] = useState<HTMLHeadingElement[]>([]);

  useEffect(() => {
    const snippet = document.createElement("div");
    snippet.innerHTML = html;
    const headings = snippet.querySelectorAll("h1, h2, h3");
    setHeadings(Array.from(headings) as HTMLHeadingElement[]);
  }, [html]);

  const toc = headings.map(heading => {
    const hash = getHeadingId(heading);
    const text = heading.innerText.replace(/¶/g, "").trim();

    return (
      <li key={hash} className="toctree-l1">
        {nohash ? (
          <Link onClick={() => scrollToHash(hash)}>{text}</Link>
        ) : (
          <HashLink smooth to={hash}>
            {text}
          </HashLink>
        )}
      </li>
    );
  });

  return headings.length ? (
    <div className="nav-internal toctree-wrapper sticky">
      <p className="caption-text">On this page:</p>
      <ul>{toc}</ul>
    </div>
  ) : null;
};

export default GeneratedInternalToc;

const getHeadingId = (heading: Element) => {
  if (heading.id) {
    return "#" + heading.id;
  }

  const childAnchor = heading.querySelector("a");
  if (childAnchor) {
    const href = childAnchor.href;
    return href.substring(href.lastIndexOf("#"), href.length);
  }

  return "";
};
