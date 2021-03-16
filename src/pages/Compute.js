import React from "react";
import Notebook from "../components/Notebook";
import { compute } from "../config/site.yml";

const Compute = () => {
  return (
    <>
      <h1>Compute documentation</h1>
      <p>Showing static content mixed with a specified rendered notebook.</p>
      <Notebook src={compute.notebookSrc} />
    </>
  );
};

export default Compute;
