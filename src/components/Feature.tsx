import React from "react";
import { getFlags } from "../utils/featureFlags";

interface FeatureProps {
  name: string;
  fallback?: React.ReactNode;
}

const Feature: React.FC<FeatureProps> = ({ name, children, fallback = null }) => {
  const flags = getFlags();
  const feature = flags.find(feature => feature.name === name);

  if (feature) {
    if (feature.active) {
      return <>{children}</>;
    }

    if (fallback) {
      return <>{fallback}</>;
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
