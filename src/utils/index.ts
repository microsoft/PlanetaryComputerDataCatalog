import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";

import { IStacCollection, IStacItem } from "types/stac";
import { DATA_URL, getDataUrl, HUB_URL } from "./constants";
import * as qs from "query-string";
import { IMosaic, IMosaicRenderOption } from "pages/Explore/types";
import { DEFAULT_MIN_ZOOM } from "pages/Explore/utils/constants";
import { useSession } from "components/auth/hooks/SessionContext";

dayjs.extend(utc);
export { dayjs };

// The represented date without consideration for the timezone
export const toAbsoluteDate = (date: Dayjs) => {
  return new Date(date.year(), date.month(), date.date());
};

export const toDateString = (
  dt: string | Date | Dayjs,
  includeTime: boolean = false
) => {
  const dateFormat = "MM/DD/YYYY";
  const timeFormat = includeTime ? "THH:mm:ss" : "";

  return dayjs(dt).format(dateFormat + timeFormat);
};

export const toUtcDateString = (dt: string | Date | Dayjs) => {
  return toDateString(dayjs.utc(dt));
};

export const toUtcDateWithTime = (dt: string) =>
  dayjs.utc(dt).format("MM/DD/YYYY, h:mm:ss A UTC");

export const toIsoDateString = (
  dt: string | Date | Dayjs,
  includeTime: boolean = true
) => {
  const dateFormat = "YYYY-MM-DD";
  const timeFormat = includeTime ? "[T]HH:mm:ss[Z]" : "";

  return dayjs(dt).format(dateFormat + timeFormat);
};

export const getDayStart = (
  date: string | Date | Dayjs | undefined,
  fromUtc: boolean = false
) => {
  const d = fromUtc ? dayjs.utc(date) : dayjs(date);
  return d.startOf("day");
};

export const getDayEnd = (
  date: string | Date | Dayjs | undefined,
  fromUtc: boolean = false
) => {
  const d = fromUtc ? dayjs.utc(date) : dayjs(date);
  return d.endOf("day");
};

export const capitalize = (value: string) => {
  const str = String(value);
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
    specialKeys.some(term => val[key]?.toLowerCase()?.includes(term));

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

  return `${HUB_URL}/user-redirect/git-pull?repo=${urlRepo}&urlpath=${urlPath}&branch=${urlBranch}`;
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

// TODO: Refactor to parse into params, not string manipulation
export const makeTileJsonUrl = (
  query: IMosaic,
  renderOption: IMosaicRenderOption | null,
  collection: IStacCollection | null,
  item: IStacItem | null,
  isHighDef: boolean = true
) => {
  const scaleParam = isHighDef ? "tile_scale=2" : "tile_scale=1";
  const minZoom = `&minzoom=${renderOption?.minZoom || DEFAULT_MIN_ZOOM}`;
  const renderParams = encodeRenderOpts(renderOption?.options);
  const format = renderOption?.options.includes("format") ? "" : "&format=png";

  // Rendering a single Item
  if (item && collection) {
    const forcePngRenderParams = renderParams.replace("jpg", "png");
    return `${DATA_URL}/item/tilejson.json?collection=${collection.id}&${scaleParam}&item=${item.id}&${forcePngRenderParams}`;
  }

  // Rendering a STAC search mosaic
  const collectionParam = collection ? `&collection=${collection.id}` : "";
  return `${DATA_URL}/mosaic/${query.searchId}/tilejson.json?&${scaleParam}&${renderParams}${minZoom}${collectionParam}${format}`;
};

export const useItemPreviewUrl = (
  item: IStacItem,
  renderOption: IMosaicRenderOption | null,
  size?: number
) => {
  const { isLoggedIn: loggedIn } = useSession();
  const maxSize = size ? `&max_size=${size}` : "";
  const url = encodeURI(`${getDataUrl(loggedIn)}/item/preview.png`);
  const renderParams = encodeRenderOpts(removeMercatorAssets(renderOption?.options));

  const params = `?collection=${item.collection}&item=${item.id}&${renderParams}${maxSize}`;

  return url + params;
};

// URIEncode any parameters provided in the renderer options
const encodeRenderOpts = (renderOpts: string | undefined) => {
  if (!renderOpts) return "";

  const paramsToEncode = ["expression", "asset_expression"];
  const renderParams = qs.parse(renderOpts, { decode: false });

  paramsToEncode.forEach(key => {
    if (key in renderParams) {
      renderParams[key] = encodeURIComponent(renderParams[key] as string);
    }
  });

  return qs.stringify(renderParams, { encode: false });
};

// Remove the suffix that designates the mercator assets from the render options
const removeMercatorAssets = (renderOpts: string = "") => {
  return renderOpts.replaceAll("_wm", "");
};
