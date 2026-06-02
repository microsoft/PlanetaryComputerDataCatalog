# Reading Planetary Computer COGs with async-geotiff

[async-geotiff](https://github.com/developmentseed/async-geotiff) is a Python Cloud Optimized GeoTIFF reader with no GDAL dependency. The core is Rust, image decoding runs in a thread pool, buffers are zero-copy, and every API is fully type-hinted. Use it when you want async I/O for pixel-level analysis without putting GDAL on the system.

A companion notebook walks through every step end-to-end. [Open in Planetary Computer Hub](https://pccompute.westeurope.cloudapp.azure.com/compute/hub/user-redirect/git-pull?repo=https://github.com/microsoft/PlanetaryComputerExamples&urlpath=lab/tree/PlanetaryComputerExamples/quickstarts/async-geotiff.ipynb&branch=main)

## Install async-geotiff

```bash
uv add async-geotiff obstore planetary-computer pystac-client lonboard matplotlib
```

`async-geotiff` is the user-facing library. `async-tiff` is the lower-level Rust core. Use it directly only if you're building library infrastructure on top.

## Find a Sentinel-2 scene on the Planetary Computer

```python
import pystac_client
import planetary_computer

catalog = pystac_client.Client.open(
    "https://planetarycomputer.microsoft.com/api/stac/v1",
    modifier=planetary_computer.sign_inplace,
)
item = next(catalog.search(
    collections=["sentinel-2-l2a"],
    bbox=[-122.7, 45.5, -122.6, 45.6],
    datetime="2024-07-01/2024-08-01",
    query={"eo:cloud_cover": {"lt": 10}},
    max_items=1,
).items())

asset = item.assets["visual"]
```

`planetary_computer.sign_inplace` signs every asset href as the search returns.

## Build an authenticated obstore store

async-geotiff reads bytes through an [obstore](https://developmentseed.org/obstore/) store. `PlanetaryComputerCredentialProvider` handles SAS token acquisition and refresh. Give it a signed asset and it figures out the account and container and mounts the store to that single blob, so the COG is opened with an empty path below:

```python
from obstore.auth.planetary_computer import PlanetaryComputerCredentialProvider
from obstore.store import AzureStore

provider = PlanetaryComputerCredentialProvider.from_asset(asset)
store = AzureStore(credential_provider=provider)
```

Set your Planetary Computer subscription key via the `PC_SDK_SUBSCRIPTION_KEY` environment variable, or pass `subscription_key=` to the provider.

## Open the COG and inspect metadata

```python
from async_geotiff import GeoTIFF

geotiff = await GeoTIFF.open("", store=store)

print(geotiff.transform)   # affine transform
print(geotiff.crs)         # PyProj CRS
print(geotiff.nodata)
print(geotiff.overviews)   # finest → coarsest
```

The header read is a single range request. This is the same pattern used by [obstore.](./obstore.md)

## Pick an overview

`geotiff.overviews` is ordered finest-to-coarsest. Index `0` is the full-resolution image. A coarser overview is the right choice for previews or zoomed-out work:

```python
full_res = geotiff.overviews[0]
coarse = geotiff.overviews[-1]
```

## Read a window

A *window* names a rectangle of pixels in image coordinates. Reading one fetches only the COG tiles that intersect the rectangle:

```python
from async_geotiff import Window

window = Window(col_off=2048, row_off=2048, width=512, height=512)
array = await full_res.read(window=window)
```

The returned `Array` has:

- `array.data`: 3D NumPy array, band-first (`(bands, rows, cols)`).
- `array.mask`: boolean mask, `True` where nodata.
- `array.transform`: affine transform for the windowed region.
- `array.as_masked()`: convert to `numpy.ma.MaskedArray`.

The `visual` asset is 3-band RGB, so transpose to band-last before previewing:

```python
import numpy as np
import matplotlib.pyplot as plt

plt.imshow(np.transpose(array.data, (1, 2, 0)))
```

```{image} images/async-geotiff-window-matplotlib.png
:height: 360
:name: async-geotiff window preview
:class: no-scaled-link
```

## Visualize the scene with Lonboard

For an interactive map view of the same Sentinel-2 item, stream its COG tiles through the Planetary Computer tiler into a [Lonboard](https://developmentseed.org/lonboard/) `BitmapTileLayer`:

```python
import json
import urllib.request

from lonboard import BitmapTileLayer, Map

tilejson = json.load(urllib.request.urlopen(
    "https://planetarycomputer.microsoft.com/api/data/v1/item/tilejson.json"
    f"?collection={item.collection_id}&item={item.id}&assets=visual"
))
lon, lat, _ = tilejson["center"]
layer = BitmapTileLayer(
    data=tilejson["tiles"][0],
    min_zoom=int(tilejson["minzoom"]),
    max_zoom=int(tilejson["maxzoom"]),
    tile_size=256,
)
Map(layer, view_state={"longitude": lon, "latitude": lat, "zoom": 11})
```

```{image} images/async-geotiff-scene-lonboard.png
:height: 500
:name: async-geotiff Lonboard scene
:class: no-scaled-link
```

## Read in parallel

Each `read()` is independent. Fire many at once with `asyncio.gather` 

async-geotiff issues range requests in parallel and decodes them on the Rust thread pool:

```python
import asyncio

windows = [
    Window(c, r, 256, 256)
    for c in range(0, 2048, 256) for r in range(0, 2048, 256)
]
arrays = await asyncio.gather(
    *[full_res.read(window=w) for w in windows]
)
```

This is the same speedup pattern the [obstore tutorial](./obstore.md) demonstrates at the raw-bytes level, one layer up the stack.

## When to use something else

- For resampling, reprojection, or warping, hand the array to [rasterio](https://rasterio.readthedocs.io/). 
- For interactive visualization, see [Lonboard](https://developmentseed.org/lonboard/). 
- For the raw-bytes layer beneath async-geotiff, see [obstore](https://developmentseed.org/obstore/). 
- For library authors building on the Rust core, drop to [async-tiff](https://github.com/developmentseed/async-tiff).
