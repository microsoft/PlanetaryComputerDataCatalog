# Visualizing Planetary Computer data with Lonboard

[Lonboard](https://developmentseed.org/lonboard/) is a Python library for interactive geospatial visualization in Jupyter. It renders large vector datasets on a GPU-accelerated WebGL map directly in the notebook, with no tile server in the loop. Geometry streams to the browser as [Apache Arrow](https://arrow.apache.org/), so hundreds of thousands of features stay interactive. Layers compose: stack footprints, points, and analysis results in a single map.

A companion notebook walks through every step end-to-end with live maps. [Open in Planetary Computer Hub](https://pccompute.westeurope.cloudapp.azure.com/compute/hub/user-redirect/git-pull?repo=https://github.com/microsoft/PlanetaryComputerExamples&urlpath=lab/tree/PlanetaryComputerExamples/quickstarts/lonboard.ipynb&branch=main)

## Install Lonboard

```bash
uv add lonboard pystac-client planetary-computer dask-geopandas adlfs
```

`pystac-client` queries the Planetary Computer STAC API; `planetary-computer` signs asset URLs; `dask-geopandas` and `adlfs` read cloud GeoParquet straight off Azure Blob.

## Connect to the Planetary Computer STAC catalog

Set up the catalog client with PC's signer so every search result has a signed asset href:

```python
import pystac_client
import planetary_computer

catalog = pystac_client.Client.open(
    "https://planetarycomputer.microsoft.com/api/stac/v1",
    modifier=planetary_computer.sign_inplace,
)
```

`modifier=planetary_computer.sign_inplace` signs every asset as the search returns.

## Find the building-footprints partition for Portland

We'll render [Microsoft Building Footprints](https://planetarycomputer.microsoft.com/dataset/ms-buildings), a dataset partitioned by [quadkey](https://learn.microsoft.com/en-us/bingmaps/articles/bing-maps-tile-system). Compute the zoom-9 quadkey for a Portland coordinate and fetch the STAC item whose partition covers it:

```python
import math


def quadkey(lat, lon, zoom):
    n = 2 ** zoom
    x = int((lon + 180.0) / 360.0 * n)
    y = int((1.0 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2.0 * n)
    digits = []
    for i in range(zoom, 0, -1):
        bit = 1 << (i - 1)
        digits.append(str((1 if x & bit else 0) + (2 if y & bit else 0)))
    return "".join(digits)


qk = quadkey(45.52, -122.66, 9)
item = next(catalog.search(
    collections=["ms-buildings"],
    query={
        "msbuildings:region": {"eq": "UnitedStates"},
        "msbuildings:quadkey": {"eq": int(qk)},
    },
).items())
asset = item.assets["data"]
```

## Load the footprints into a GeoDataFrame

The asset is a Delta/Parquet partition on Azure Blob. `dask_geopandas.read_parquet` reads it with the asset's `table:storage_options` (account + SAS), then `.compute()` materializes a GeoDataFrame. Clip to the Portland metro for a focused view:

```python
import dask_geopandas

gdf = dask_geopandas.read_parquet(
    asset.href,
    storage_options=asset.extra_fields["table:storage_options"],
).compute()
gdf = gdf.cx[-122.85:-122.45, 45.42:45.62]

len(gdf)  # a few hundred thousand buildings
```

## Render the footprints

`PolygonLayer.from_geopandas()` uploads the geometry to the GPU as Arrow. Drawing the footprints as outlines keeps every building legible at city scale, and the map stays fully interactive with no tile server in the loop:

```python
from lonboard import Map, PolygonLayer

layer = PolygonLayer.from_geopandas(
    gdf,
    get_line_color=[230, 100, 0],
    filled=False,
    line_width_min_pixels=0.5,
)
Map(layer, view_state={"longitude": -122.66, "latitude": 45.52, "zoom": 12})
```

```{image} images/lonboard-buildings-portland.png
:height: 500
:name: Lonboard building footprints over Portland
:class: no-scaled-link
```

## Color by building height

Each footprint carries a `meanHeight`. Map it through a continuous colormap and recolor the layer in place: data-driven styling across the whole dataset, evaluated on the GPU:

```python
import matplotlib as mpl
from lonboard.colormap import apply_continuous_cmap

heights = gdf["meanHeight"].clip(0, 30)
normalized = (heights - heights.min()) / (heights.max() - heights.min())

layer.get_line_color = apply_continuous_cmap(
    normalized.to_numpy(), mpl.colormaps["plasma"]
)
layer.line_width_min_pixels = 1.5
```

`plasma` shades low buildings purple and tall ones yellow. Reassigning the property mutates the existing map without re-uploading geometry.

```{image} images/lonboard-buildings-by-height.png
:height: 420
:name: Lonboard building footprints colored by height
:class: no-scaled-link
```

## When to use something else

Lonboard's surface is the notebook. For pixel-level *raster* analysis in Python (window reads, overview traversal), use [async-geotiff](https://github.com/developmentseed/async-geotiff). For a standalone web app instead of a notebook, the [deck.gl-raster](https://github.com/developmentseed/deck.gl-raster) renderer is available in TypeScript. For shareable tile endpoints consumed by third-party frontends, see [titiler](https://developmentseed.org/titiler/).
