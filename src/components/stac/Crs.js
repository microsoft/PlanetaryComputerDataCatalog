import React from "react";
import LabeledValue from "../controls/LabeledValue";
import { useStac } from "./CollectionContext";

const Crs = () => {
  const collection = useStac();

  // CRS information could be in many different places
  // First attempt is with cube extension dimensions
  const cube = collection["cube:dimensions"];
  const crs = cube
    ? Object.values(cube)
        .filter(dimension => {
          return dimension.type === "spatial";
        })
        .map(({ description, reference_system }) => {
          return { description, referenceSystem: reference_system };
        })
        .pop()
    : null;

  if (!crs) return null;

  // TODO: icon popover with reference system value (proj4 json)
  return <LabeledValue label="CRS">{crs.description}</LabeledValue>;
};

export default Crs;
