export const initializeFeatures = () => {
  const flags = getFlags();
  // {
  //   name:,
  //   description:,
  //   active:
  // }
  const initialFlags = [];

  // Merge old flags with new flags, keeping the existing `active` setting
  const updatedFlags = initialFlags.map(f => {
    return { ...f, ...flags.find(fl => fl.name === f.name) };
  });

  localStorage.setItem("flags", JSON.stringify(updatedFlags));
};

export const getFlags = () => {
  return JSON.parse(localStorage.getItem("flags")) || [];
};
