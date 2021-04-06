import React from "react";
import { Link } from "react-router-dom";

// Mimic the structure of a Sphinx generated TOC item, so we can apply more
// items to the list at runtime.
const TocTreeItem = ({ title, links }) => {
  return (
    <div className="toctree-wrapper compound">
      <p>
        <span className="caption-text">{title}</span>
      </p>
      <ul>
        {links.map(({ href, label }) => (
          <li className="toctree-l1" key={`toc-ref-${label}`}>
            <Link to={href} className="reference internal">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TocTreeItem;
