import { Link } from "@fluentui/react";

const NewTabLink = ({
  href,
  ariaLabel = "Link will open in new tab",
  title = null,
  children,
  style = null,
  As = Link,
}) => {
  return (
    <As
      href={href}
      aria-label={ariaLabel}
      target="_blank"
      rel="noopener noreferrer"
      style={style}
      title={title}
    >
      {children}
    </As>
  );
};

export default NewTabLink;
