export const getRelativeSelfPath = (links) => {
  const href = links.find((l) => l.rel === "self").href;
  const url = new URL(href);
  return url.pathname;
};
