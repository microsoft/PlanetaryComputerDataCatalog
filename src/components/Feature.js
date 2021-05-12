import { getFlags } from "../utils/featureFlags";

const Feature = ({ name, fallback, children }) => {
  const flags = getFlags();
  const feature = flags.find(feature => feature.name === name);

  if (feature) {
    if (feature.active) {
      return children;
    }

    if (fallback) {
      return fallback;
    }
  }

  if (process.env.NODE_ENV === "development" && !feature) {
    console.warn(
      `
        Feature not found: "${name}".
        Available features are:
            ${flags.map(feature => `• ${feature.name}`).join("\n")}
        `
    );
  }

  return null;
};

export default Feature;
