# Building an analysis-ready data cube from Planetary Computer STAC

A STAC search returns item metadata: hrefs, dates, cloud cover. Analysis usually wants something else, a single aligned array indexed by time, band, and space, that you can run math across. Two libraries build that cube from STAC items: [odc-stac](https://odc-stac.readthedocs.io/) and [stackstac](https://stackstac.readthedocs.io/). They take the same inputs and produce lazy, Dask-backed xarray objects, but they differ in ways that matter on Planetary Computer data.

This cube shape suits time-series and multi-band analysis across an area. When you only need pixels from a single scene, skip the cube and read the window directly with [async-geotiff](./async-geotiff.md).

A companion notebook runs both side by side. [Open in Planetary Computer Hub](https://pccompute.westeurope.cloudapp.azure.com/compute/hub/user-redirect/git-pull?repo=https://github.com/microsoft/PlanetaryComputerExamples&urlpath=lab/tree/PlanetaryComputerExamples/quickstarts/odc-stac.ipynb&branch=main)

## Install

```bash
uv add odc-stac stackstac pystac-client planetary-computer
```

Both libraries lean on Dask for lazy, chunked loading, which `odc-stac` and `stackstac` pull in as a dependency.

## Search the catalog

Open the catalog with the Planetary Computer signer so every returned asset href is signed, then search for a few low-cloud Sentinel-2 scenes over Portland.

```python
import pystac_client
import planetary_computer

catalog = pystac_client.Client.open(
    "https://planetarycomputer.microsoft.com/api/stac/v1",
    modifier=planetary_computer.sign_inplace,
)
items = list(catalog.search(
    collections=["sentinel-2-l2a"],
    bbox=[-122.7, 45.5, -122.6, 45.6],
    datetime="2024-07-01/2024-08-01",
    query={"eo:cloud_cover": {"lt": 20}},
    max_items=4,
).items())
```

## Load with odc-stac

`odc.stac.load` reads the items into an `xarray.Dataset`, one named variable per band. It infers the coordinate reference system and resolution from the STAC metadata, so you only specify what you want to change.

```python
import odc.stac

cube = odc.stac.load(
    items,
    bands=["B04", "B03", "B02"],
    bbox=[-122.7, 45.5, -122.6, 45.6],
    resolution=10,
    chunks={"time": 1, "x": 1024, "y": 1024},
)
# Dataset, dims (time, y, x), bands B04/B03/B02 as float32, CRS EPSG:32610 (auto)
```

The bands arrive as separate `data_vars`, which reads naturally when you reference them by name (`cube.B04`). Values come back as `float32`.

## Load with stackstac

`stackstac.stack` produces a single `xarray.DataArray` with a `band` dimension instead of named variables. On Planetary Computer Sentinel-2, it needs one thing odc-stac did not: an explicit CRS.

```python
import stackstac

cube = stackstac.stack(
    items,
    assets=["B04", "B03", "B02"],
    bounds_latlon=[-122.7, 45.5, -122.6, 45.6],
    resolution=10,
    epsg=32610,        # required: see below
    chunksize=1024,
)
# DataArray, dims (time, band, y, x), float64
```

Without `epsg=`, the call raises `Cannot pick a common CRS, since asset 'B04' ... does not have one`. The Planetary Computer's Sentinel-2 items do not expose a per-asset CRS that stackstac can infer, so you supply it. In exchange, stackstac attaches every STAC item property to the cube as a coordinate (cloud cover, processing baseline, and dozens more), which is convenient when you want to filter or group the cube by metadata later.

## How they compare

| | odc-stac | stackstac |
|---|---|---|
| CRS on PC Sentinel-2 | inferred automatically | must pass `epsg=` |
| Shape | `Dataset`, named bands, dims `(time, y, x)` | `DataArray`, `band` dim, dims `(time, band, y, x)` |
| dtype | `float32` | `float64` (twice the memory) |
| STAC metadata | not attached | every item property as a coordinate |

## A recommendation

For Planetary Computer work, odc-stac is the smoother default. It infers the CRS, returns named bands, and uses `float32`, which halves memory before you have done anything. stackstac earns its place when you want the full STAC metadata riding along on the cube as coordinates, or when you already have stackstac code and a single `DataArray` fits your pipeline.

Migrating a stackstac call to odc-stac is mostly renaming: `assets` becomes `bands`, `bounds_latlon` becomes `bbox`, and you can drop the `epsg=` argument. Reference bands by name afterward rather than selecting along a `band` dimension.

## Run the notebook

Both loads run side by side in the companion notebook. [Open in Planetary Computer Hub](https://pccompute.westeurope.cloudapp.azure.com/compute/hub/user-redirect/git-pull?repo=https://github.com/microsoft/PlanetaryComputerExamples&urlpath=lab/tree/PlanetaryComputerExamples/quickstarts/odc-stac.ipynb&branch=main)
