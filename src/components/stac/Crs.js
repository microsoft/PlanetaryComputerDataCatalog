import NewTabLink from "components/controls/NewTabLink";

import LabeledValue from "../controls/LabeledValue";
import { useStac } from "./CollectionContext";
import ProjJsonCrs from "./ProjJsonCrs";

const Crs = () => {
  const collection = useStac();

  // CRS information could be in many different places
  // First attempt is with cube extension dimensions
  const cube = collection["cube:dimensions"];
  if (!cube) return null;

  const crs = cube
    ? Object.values(cube)
        .filter(dimension => {
          return dimension.type === "spatial";
        })
        .map(({ reference_system }) => reference_system)
        .pop()
    : null;

  let crsInfo;
  if (crs?.conversion?.method?.name) {
    // ProjJSON
    crsInfo = <ProjJsonCrs crs={crs} />;
  } else if (Number.isInteger(crs)) {
    // EPSG Code
    crsInfo = (
      <NewTabLink href={`https://epsg.io/${crs}`}>{`EPSG:${crs}`}</NewTabLink>
    );
  }

  return crsInfo ? <LabeledValue label="CRS">{crsInfo}</LabeledValue> : null;
};

export default Crs;
