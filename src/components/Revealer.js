import { Link } from "@fluentui/react";
import React, { useState } from "react";

const Revealer = ({ children }) => {
  const [revealed, setRevealed] = useState(false);

  const handleClick = () => {
    setRevealed(!revealed);
  };
  return (
    <div>
      <Link onClick={handleClick}>{revealed ? "hide" : "show"}</Link>
      {revealed && children}
    </div>
  );
};

export default Revealer;
