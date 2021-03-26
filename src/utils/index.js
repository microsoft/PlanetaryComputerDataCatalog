export const byKey = key => {
  return (a, b) => {
    if (a[key] < b[key]) {
      return -1;
    }
    if (a[key] > b[key]) {
      return 1;
    }
    return 0;
  };
};

export const buildHubLaunchUrl = ({ repo, filePath, branch }) => {
  const urlRepo = encodeURIComponent(repo);
  const urlBranch = encodeURIComponent(branch);

  const repoName = repo.split("/").pop();
  const pathPrefix = filePath.endsWith(".ipynb") ? "lab/tree" : "rstudio";
  const urlPath = encodeURIComponent(`${pathPrefix}/${repoName}/${filePath}`);

  return `${process.env.REACT_APP_HUB_URL}?repo=${urlRepo}&urlpath=${urlPath}&branch=${urlBranch}`;
};

export const buildGitHubUrl = ({ repo, filePath, branch }) => {
  return `${repo}/blob/${branch}/${filePath}`;
};
