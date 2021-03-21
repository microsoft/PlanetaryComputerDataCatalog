import React from "react";
import Layout from "../components/Layout";
import Notebook from "../components/Notebook";
import { compute } from "../config/site.yml";

const Compute = () => {
  return (
    <Layout>
      <h1>Compute documentation</h1>
      <p>Showing static content mixed with a specified rendered notebook.</p>
      <Notebook src={compute.notebookSrc} />
    </Layout>
  );
};

export default Compute;
