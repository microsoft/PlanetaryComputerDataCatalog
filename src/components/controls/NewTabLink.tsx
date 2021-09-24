import { Link } from "@fluentui/react";

interface NewTabLinkProps {
  href: string;
  ariaLabel?: string;
  title?: string;
  style?: React.CSSProperties;
  As?: any;
}
const NewTabLink: React.FC<NewTabLinkProps> = ({
  href,
  ariaLabel = "Link will open in new tab",
  title = "",
  children,
  style = {},
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
