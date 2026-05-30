# Visualizing Planetary Computer data with Lonboard

[Lonboard](https://developmentseed.org/lonboard/) is a Python library for interactive geospatial visualization in Jupyter. It renders Cloud Optimized GeoTIFFs and vector data on a GPU-accelerated WebGL map directly in the notebook, with no tile server in the loop. Raster and vector layers compose: stack imagery, footprints, and analysis results in a single map.

A companion notebook walks through every step end-to-end with live maps. [Open in Planetary Computer Hub](https://pccompute.westeurope.cloudapp.azure.com/compute/hub/user-redirect/git-pull?repo=https://github.com/microsoft/PlanetaryComputerExamples&urlpath=lab/tree/PlanetaryComputerExamples/quickstarts/lonboard.ipynb&branch=main)

## Install Lonboard

```bash
uv add lonboard pystac-client planetary-computer geopandas
```

`pystac-client` queries the Planetary Computer STAC API; `planetary-computer` signs asset URLs; `geopandas` is for vector overlays.

## Connect to the Planetary Computer STAC catalog

Lonboard reads directly from STAC items. Set up the catalog client with PC's signer so every search result has a signed asset href:

```python
import pystac_client
import planetary_computer

catalog = pystac_client.Client.open(
    "https://planetarycomputer.microsoft.com/api/stac/v1",
    modifier=planetary_computer.sign_inplace,
)
```

`modifier=planetary_computer.sign_inplace` signs every asset as the search returns.

## Render NAIP imagery

Search for scenes over Portland, OR, then pass the returned items to `RasterLayer.from_stac()`:

```python
from lonboard import Map
from lonboard.experimental import RasterLayer

items = catalog.search(
    collections=["naip"],
    bbox=[-122.7, 45.5, -122.6, 45.6],
    datetime="2022-01-01/2023-01-01",
).item_collection()

Map(RasterLayer.from_stac(items))
```

The map renders inline. As you pan and zoom, Lonboard fetches only the COG tiles needed for the current viewport — no whole-file downloads.

> **📷 Screenshot:** Interactive map of Portland with NAIP imagery loaded, zoomed in enough to see the tile grid pattern.

## Adjust the render

Tune opacity to compare layers, or apply a colormap for single-band rasters (NDVI, classification):

```python
layer = RasterLayer.from_stac(items)
layer.opacity = 0.7
```

For single-band data:

```python
RasterLayer.from_stac(items, colormap_name="viridis", rescale=(-1, 1))
```

Re-running the cell with different `colormap_name` values compares options without re-fetching tiles.

## Combine raster with vector overlays

Mix raster and vector layers in a single map. Here, draw STAC item footprints on top of the NAIP imagery:

```python
import geopandas as gpd
from lonboard import PathLayer

footprints = gpd.GeoDataFrame.from_features(items.to_dict())
footprint_layer = PathLayer.from_geopandas(
    footprints.boundary.to_frame("geometry")
)

Map([RasterLayer.from_stac(items), footprint_layer])
```

The same pattern works for any GeoDataFrame: building footprints, points of interest, analysis results from a query.

> **📷 Screenshot:** Same NAIP map with STAC item footprints outlined on top.

## Reach for something else when…

Lonboard's surface is the notebook. For pixel-level analysis in Python (window reads, overview traversal), use [async-geotiff](https://github.com/developmentseed/async-geotiff). For a standalone web app instead of a notebook, the same renderer is available in TypeScript as [deck.gl-raster](https://github.com/developmentseed/deck.gl-raster). For shareable tile endpoints consumed by third-party frontends, see [titiler](https://developmentseed.org/titiler/).
