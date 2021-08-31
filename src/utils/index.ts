import { IStacCollection, IStacItem } from "types/stac";
import { DATA_URL } from "./constants";
import * as qs from "query-string";
import { IMosaic, IMosaicRenderOption } from "pages/Explore/types";

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const titleCase = (str: string) => {
  return str.split(" ").map(capitalize).join(" ");
};

export const isort = (a: string, b: string) =>
  a.localeCompare(b, undefined, { sensitivity: "base" });

const sortAlphaByKey = (key: string) => {
  return (a: any, b: any) => {
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
export const sortSpecialByKey = (key: string) => {
  const specialKeys = ["landsat", "sentinel"];
  const isSpecial = (val: any) =>
    specialKeys.some(term => val[key].toLowerCase().includes(term));

  return (a: any, b: any) => {
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

export const sortByLookup = (lookup: any) => {
  const get = (k: string) => lookup[k] ?? 50;

  return (a: string, b: string) => {
    if (get(a) < get(b)) {
      return -1;
    }
    if (get(a) > get(b)) {
      return 1;
    }
    return 0;
  };
};

export const sortByPosition = (list: any) => {
  return sortByLookup(
    Object.fromEntries(list.map((item: any, idx: number) => [item, idx]))
  );
};

interface ILauncherConfig {
  repo: string;
  branch: string;
  filePath: string;
}

const configFromLauncher = (launcher: ILauncherConfig | string): ILauncherConfig => {
  let config: ILauncherConfig;
  if (typeof launcher === "string") {
    config = {
      branch: "main",
      filePath: launcher,
      repo: "https://github.com/microsoft/PlanetaryComputerExamples",
    };
  } else {
    config = launcher;
  }
  return config;
};

export function buildHubLaunchUrl(filePath: string): string;
export function buildHubLaunchUrl(launchConfig: ILauncherConfig): string;
export function buildHubLaunchUrl(launcher: ILauncherConfig | string): string {
  const { repo, branch, filePath } = configFromLauncher(launcher);
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
}

export function buildGitHubUrl(launcher: ILauncherConfig): string;
export function buildGitHubUrl(launcher: string): string;
export function buildGitHubUrl(launcher: ILauncherConfig | string): string {
  const { repo, branch, filePath } = configFromLauncher(launcher);
  return `${repo}/blob/${branch}/${filePath}`;
}

/*
  For markup that was generated from external tools (marked, nbconvert, etc) run through
  some DOM manipulations to alter the structure for accessibility reasons
*/
export const a11yPostProcessDom = (dom: Document) => {
  // Find img tags without an alt tag, and add one
  dom
    .querySelectorAll("img:not([alt]")
    .forEach(el => el.setAttribute("alt", "Calculated image output"));

  // Keyboard users needs a tabindex set on scrollable content if they
  // otherwise do not have focusable content. These python codeblocks are
  // brought over from nbconvert and must have a tabindex set to all keyboard
  // scrolling.
  dom.querySelectorAll(".highlight pre").forEach(el => {
    el.setAttribute("tabindex", "0");
  });
};

export const scrollToHash = (
  elementId: string,
  behavior: ScrollBehavior = "smooth"
) => {
  // Remove the hash
  const id = elementId.substring(elementId.lastIndexOf("#") + 1);

  return () => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: behavior });
    }
  };
};

export const makeTileJsonUrl = (
  collection: IStacCollection,
  query: IMosaic,
  renderOption: IMosaicRenderOption | null,
  item: IStacItem | null
) => {
  const itemParam = item ? `&items=${item.id}` : "";
  const tileEndpoint = item ? "item" : "collection";

  return `${DATA_URL}/${tileEndpoint}/tilejson.json?hash=${query.hash}&collection=${collection.id}&${renderOption?.options}${itemParam}`;
};

export const makeItemPreviewUrl = (
  item: IStacItem,
  renderOption: IMosaicRenderOption,
  size?: number
) => {
  const maxSize = size ? `&max_size=${size}` : "";
  const url = encodeURI(`${DATA_URL}/item/preview.png`);

  // URIEncode any parameters provided in the renderer options
  const renderParams = qs.parse(renderOption.options, { decode: false });
  if ("expression" in renderParams) {
    renderParams["expression"] = encodeURIComponent(
      renderParams["expression"] as string
    );
  }

  const params = `?collection=${item.collection}&items=${item.id}&${qs.stringify(
    renderParams,
    { encode: false }
  )}${maxSize}`;

  return url + params;
};
