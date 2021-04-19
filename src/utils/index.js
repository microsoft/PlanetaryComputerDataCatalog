const sortAlphaByKey = key => {
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

// Alpha sort, except favor special terms to the begining
export const sortSpecialByKey = key => {
  const specialKeys = ["landsat", "sentinel"];
  const isSpecial = val =>
    specialKeys.some(term => val[key].toLowerCase().includes(term));

  return (a, b) => {
    const aSpecial = isSpecial(a);
    const bSpecial = isSpecial(b);

    if (aSpecial && bSpecial) {
      return sortAlphaByKey(key)(a, b);
    } else if (aSpecial && !bSpecial) {
      return -1;
    } else if (!aSpecial && bSpecial) {
      return 1;
    }
    return sortAlphaByKey(key)(a, b);
  };
};

export const sortByLookup = lookup => {
  const get = k => lookup[k] ?? 50;

  return (a, b) => {
    if (get(a) < get(b)) {
      return -1;
    }
    if (get(a) > get(b)) {
      return 1;
    }
    return 0;
  };
};

export const buildHubLaunchUrl = ({ repo, filePath, branch }) => {
  const urlRepo = encodeURIComponent(repo);
  const urlBranch = encodeURIComponent(branch);

  const repoName = repo.split("/").pop();

  // Get a unique but arbitrary string for the workspace path. This works
  // around in issue where nbgitpuller workspace may conflict with JupyterHub.
  // The workspace can't contain / so substitue a - for any.
  const fileWorkspace = filePath
    .substring(filePath.indexOf("/") + 1, filePath.lastIndexOf("."))
    .replace(/\//g, "-");

  const pathPrefix = filePath.endsWith(".ipynb")
    ? `lab/workspaces/${fileWorkspace}/tree`
    : "rstudio";

  const urlPath = encodeURIComponent(`${pathPrefix}/${repoName}/${filePath}`);

  return `${process.env.REACT_APP_HUB_URL}/hub/user-redirect/git-pull?repo=${urlRepo}&urlpath=${urlPath}&branch=${urlBranch}`;
};

export const buildGitHubUrl = ({ repo, filePath, branch }) => {
  return `${repo}/blob/${branch}/${filePath}`;
};
