import React from "react";
import { Spinner, SpinnerSize } from "@fluentui/react";
import "../styles/notebook.css";
import { useStaticMetadata } from "../utils/requests";

const Notebook = ({ src }) => {
  const { isSuccess, data } = useStaticMetadata(src);
  const notebook = isSuccess ? (
    <div dangerouslySetInnerHTML={{ __html: data }}></div>
  ) : (
    <Spinner
      styles={{ root: { marginTop: "275px" } }}
      size={SpinnerSize.large}
    />
  );

  return notebook;
};

export default Notebook;
