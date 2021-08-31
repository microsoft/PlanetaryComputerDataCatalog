import { Link, useTheme } from "@fluentui/react";

interface ZoomMessageProps {
  onClick: () => void;
}

const ZoomMessage = ({ onClick }: ZoomMessageProps) => {
  const theme = useTheme();

  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: "50%",
        transform: "translate(-50%, 0)",
        zIndex: 1,
        padding: "5px 10px",
        borderRadius: 15,
        border: "1px solid",
        borderColor: theme.semanticColors.buttonBorder,
        backgroundColor: theme.semanticColors.bodyBackground,
        boxShadow: theme.effects.elevation8,
      }}
    >
      <Link onClick={onClick}>Zoom in</Link> to see layer
    </div>
  );
};
export default ZoomMessage;
