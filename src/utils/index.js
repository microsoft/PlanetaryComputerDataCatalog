export const capitalize = str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const titleCase = str => {
  return str.split(" ").map(capitalize).join(" ");
};

export const tagCase = str => {
  if (str.length <= 4) {
    return str.toUpperCase();
  }
  return titleCase(str);
};

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

// Alpha sort, except favor special terms to the beginning
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
  // The workspace can't contain / so substitute a - for any.
  const fileWorkspace = filePath
    .substring(filePath.indexOf("/") + 1, filePath.lastIndexOf("."))
    .replace(/\//g, "-");

  const pathPrefix = filePath.endsWith(".ipynb")
    ? `lab/workspaces/${fileWorkspace}/tree`
    : "rstudio";

  const urlPath = encodeURIComponent(`${pathPrefix}/${repoName}/${filePath}`);

  return `${process.env.REACT_APP_HUB_URL}?repo=${urlRepo}&urlpath=${urlPath}&branch=${urlBranch}`;
};

export const buildGitHubUrl = ({ repo, filePath, branch }) => {
  return `${repo}/blob/${branch}/${filePath}`;
};

/*
  For markup that was generated from external tools (marked, nbconvert, etc) run through
  some DOM manipulations to alter the structure for accessibility reasons
*/
export const a11yPostProcessDom = dom => {
  // Find img tags without an alt tag, and add one
  dom
    .querySelectorAll("img:not([alt]")
    .forEach(el => el.setAttribute("alt", "Calculated image output"));

  // Keyboard users needs a tabindex set on scrollable content if they
  // otherwise do not have focusable content. These python codeblocks are
  // brought over from nbconvert and must have a tabindex set to all keyboard
  // scrolling.
  dom.querySelectorAll(".highlight pre").forEach(el => {
    el.setAttribute("tabindex", 0);
  });
};

export const scrollToHash = (elementId, behavior = "smooth") => {
  // Remove the hash
  const id = elementId.substring(elementId.lastIndexOf("#") + 1);

  return () => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: behavior });
    }
  };
};
