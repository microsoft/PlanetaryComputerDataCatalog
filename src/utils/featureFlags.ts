type FeatureFlag = {
  name: string;
  description: string;
  active: boolean;
};

export const initializeFeatures = () => {
  const flags = getFlags();
  const initialFlags: FeatureFlag[] = [
    { name: "login", description: "Test login", active: false },
    { name: "pin", description: "Pin layer to map", active: false },
  ];

  // Merge old flags with new flags, keeping the existing `active` setting
  const updatedFlags = initialFlags.map(initialFlag => {
    return {
      ...initialFlag,
      ...flags.find(existingFlag => existingFlag.name === initialFlag.name),
    };
  });

  localStorage.setItem("flags", JSON.stringify(updatedFlags));
};

export const getFlags = (): FeatureFlag[] => {
  const storedFlags = localStorage.getItem("flags");
  return storedFlags ? JSON.parse(storedFlags) : [];
};
