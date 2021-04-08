import React, { useEffect, useState } from "react";
import { HashLink } from "react-router-hash-link";

const GeneratedInternalToc = ({ html }) => {
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    const snippet = document.createElement("div");
    snippet.innerHTML = html;
    const headings = snippet.querySelectorAll("h1, h2, h3");
    setHeadings(Array.from(headings));
  }, [html]);

  const toc = headings.map(heading => {
    const href = heading.querySelector("a").href;
    const hash = href.substring(href.lastIndexOf("#"), href.length);
    const text = heading.innerText.replace(/¶/g, "");

    return (
      <li key={hash} className="toctree-l1">
        <HashLink smooth to={hash}>
          {text}
        </HashLink>
      </li>
    );
  });

  return (
    <div className="nav-internal toctree-wrapper sticky">
      <p className="caption-text">On this page:</p>
      <ul>{toc}</ul>
    </div>
  );
};

export default GeneratedInternalToc;
