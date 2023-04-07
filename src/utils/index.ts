import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";

import { IStacCollection, IStacItem } from "types/stac";
import { DATA_URL, HUB_URL, QS_REQUEST_ENTITY, REQUEST_ENTITY } from "./constants";
import * as qs from "query-string";
import { IMosaic, IMosaicRenderOption } from "pages/Explore/types";
import { DEFAULT_MIN_ZOOM } from "pages/Explore/utils/constants";

dayjs.extend(utc);
export { dayjs };

// The represented date without consideration for the timezone
export const toAbsoluteDate = (date: Dayjs) => {
  return new Date(date.year(), date.month(), date.date());
};

export const capitalize = (value: string) => {
  const str = String(value);
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const titleCase = (str: string, splitChar: string = " ") => {
  return str.split(splitChar).map(capitalize).join(" ");
};

export const isort = (a: string, b: string) =>
  a.localeCompare(b, undefined, { sensitivity: "base" });

const sortAlphaByKey = (key: string) => {
  return (a: any, b: any) => {
    const al = a[key].toLowerCase();
    const bl = b[key].toLowerCase();

    if (al < bl) {
      return -1;
    }
    if (al > bl) {
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
  // Find img tags without an alt tag, and make it a presentation role
  dom
    .querySelectorAll("img:not([alt]")
    .forEach(el => el.setAttribute("role", "presentation"));

  // Look for anchor tags with only an image inside, and make give the anchor
  // a title attribute
  dom.querySelectorAll("a > img").forEach(el => {
    el.parentElement?.setAttribute("title", "Link to image content");
  });

  // Look for .dataframe with an empty header and add the text id. It may
  // also have a value on the next header row, so remove that as well.
  dom
    .querySelectorAll(".dataframe > thead > tr > th:nth-child(1)")
    .forEach(header => {
      if (header.textContent === "") {
        const nextHeader =
          header.parentElement?.nextElementSibling?.firstElementChild;
        if (nextHeader && nextHeader.textContent) {
          header.textContent = nextHeader.textContent;
          nextHeader.parentElement?.remove();
        } else {
          header.textContent = "row_id";
        }
      }
    });

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
  const el = document.getElementById(id);

  if (el) {
    el.scrollIntoView({ behavior: behavior });
  }
};

// TODO: Refactor to parse into params, not string manipulation
export const makeRasterTileJsonUrl = (
  query: IMosaic,
  renderOption: IMosaicRenderOption | null,
  collection: IStacCollection | null,
  item: IStacItem | null,
  isHighDef: boolean = true
) => {
  const scaleParam = isHighDef ? "tile_scale=2" : "tile_scale=1";
  const minZoom = `&minzoom=${renderOption?.minZoom || DEFAULT_MIN_ZOOM}`;
  const renderParams = encodeRenderOpts(renderOption?.options);
  const format = renderOption?.options?.includes("format") ? "" : "&format=png";

  // Rendering a single Item
  if (item && collection) {
    return `${DATA_URL}/item/tilejson.json?collection=${collection.id}&${scaleParam}&item=${item.id}&${renderParams}${format}`;
  }

  // Rendering a STAC search mosaic
  const collectionParam = collection ? `&collection=${collection.id}` : "";
  return `${DATA_URL}/mosaic/${query.searchId}/tilejson.json?&${scaleParam}&${renderParams}${minZoom}${collectionParam}${format}`;
};

export const getTileJsonAsset = (
  collection: IStacCollection,
  renderOption: IMosaicRenderOption
): string => {
  const tilejsonKey = renderOption?.vectorOptions?.tilejsonKey;
  if (!tilejsonKey) {
    throw new Error("No tilejsonKey found in renderOption");
  }

  const asset = collection.assets?.[tilejsonKey];
  if (!asset) {
    throw new Error(`No asset found for key: ${tilejsonKey}`);
  }
  return asset.href;
};

export const useItemPreviewUrl = (
  item: IStacItem,
  renderOption: IMosaicRenderOption | null,
  size?: number
) => {
  const maxSize = size ? `&max_size=${size}` : "";
  const url = encodeURI(`${DATA_URL}/item/preview.png`);
  const renderParams = encodeRenderOpts(removeMercatorAssets(renderOption?.options));

  const params = `?collection=${item.collection}&item=${item.id}&${renderParams}${maxSize}&${QS_REQUEST_ENTITY}=${REQUEST_ENTITY}`;

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
const removeMercatorAssets = (renderOpts: string | null = "") => {
  return renderOpts?.replaceAll("_wm", "");
};
