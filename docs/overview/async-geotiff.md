# Reading Planetary Computer COGs with async-geotiff

[async-geotiff](https://github.com/developmentseed/async-geotiff) is a Python [Cloud Optimized GeoTIFF](https://cogeo.org/) reader with no GDAL dependency. The core is Rust, image decoding runs in a thread pool, buffers are zero-copy, and every API is fully type-hinted. Use it when you want async I/O for pixel-level analysis without putting GDAL on the system.

A companion notebook walks through every step end-to-end. [Open in Planetary Computer Hub](https://pccompute.westeurope.cloudapp.azure.com/compute/hub/user-redirect/git-pull?repo=https://github.com/microsoft/PlanetaryComputerExamples&urlpath=lab/tree/PlanetaryComputerExamples/quickstarts/async-geotiff.ipynb&branch=main)

## Install async-geotiff

```bash
uv add async-geotiff obstore planetary-computer pystac-client lonboard matplotlib pillow
```

`async-geotiff` is the high-level library for reading GeoTIFF and COG files. `async-tiff` is the lower-level Rust core for generically reading TIFF files. It shouldn't be necessary to touch for most users.

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

The header read usually fits in one or two range requests, facilitated by [obstore](./obstore.md).

## Pick a resolution

`geotiff` itself is the full-resolution image. `geotiff.overviews` is the resolution pyramid *below* the full-resolution data, ordered finest-to-coarsest — index `0` is the finest overview, index `-1` is the coarsest. For zoomed-out previews or quick checks, read from a coarser overview; for analysis, read from `geotiff` directly:

```python
full_res = geotiff             # full resolution
coarse = geotiff.overviews[-1] # smallest overview, good for previews
```

## Read a window

A *window* names a rectangle of pixels in image coordinates. Reading one fetches only the COG tiles that intersect the rectangle:

```python
from async_geotiff import Window

window = Window(col_off=2048, row_off=2048, width=512, height=512)
raster_array = await full_res.read(window=window)
```

The returned `RasterArray` has:

- `raster_array.data`: 3D NumPy array, band-first (`(bands, rows, cols)`).
- `raster_array.mask`: boolean mask, `True` where nodata.
- `raster_array.transform`: affine transform for the windowed region.
- `raster_array.as_masked()`: convert to `numpy.ma.MaskedArray`.

The `visual` asset is 3-band RGB. Use `reshape_as_image` to swap to image axis order (`(rows, cols, bands)`) before previewing:

```python
import matplotlib.pyplot as plt
from async_geotiff.utils import reshape_as_image

plt.imshow(reshape_as_image(raster_array.data))
```

```{image} images/async-geotiff-window-matplotlib.png
:height: 360
:name: async-geotiff window preview
:class: no-scaled-link
```

## Visualize the scene with Lonboard

For an interactive map view of the same Sentinel-2 item, hand the open `GeoTIFF` to [Lonboard](https://developmentseed.org/lonboard/)'s `RasterLayer.from_geotiff()`. Lonboard streams tiles through async-geotiff directly — no separate tile server in the loop. You supply a `render_tile` callback that turns each tile's raw `RasterArray` into a PNG:

```python
import io

import numpy as np
from async_geotiff import Tile as GeoTIFFTile
from async_geotiff.utils import reshape_as_image
from lonboard import Map, RasterLayer
from lonboard.raster import EncodedImage
from PIL import Image


def render_visual_tile(tile: GeoTIFFTile) -> EncodedImage:
    masked = reshape_as_image(tile.array.as_masked())
    rgb = masked.data
    mask = masked.mask
    if mask.ndim == 0:
        alpha = np.full(rgb.shape[:2], 255, dtype=np.uint8)
    elif mask.ndim == 2:
        alpha = (~mask).astype(np.uint8) * 255
    else:
        alpha = (~mask.any(axis=-1)).astype(np.uint8) * 255
    rgba = np.concatenate([rgb, alpha[..., None]], axis=-1)
    img = Image.fromarray(rgba)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return EncodedImage(data=buf.getvalue(), media_type="image/png")


Map(RasterLayer.from_geotiff(geotiff, render_tile=render_visual_tile), height=800)
```

```{image} images/async-geotiff-scene-lonboard.png
:height: 500
:name: async-geotiff Lonboard scene
:class: no-scaled-link
```

## Read large regions in a single call

For a large region, don't fan out independent `read()` calls over a grid of small windows. `read()` walks the COG's internal tile layout itself and coalesces the necessary range requests into the minimum number of round-trips — fewer requests, faster overall:

```python
window = Window(0, 0, 2048, 2048)
raster_array = await full_res.read(window=window)
```

This is the same coalescing pattern the [obstore tutorial](./obstore.md) demonstrates with `get_ranges` at the raw-bytes level — one layer up the stack.

## When to use something else

- For resampling, reprojection, or warping, use [rasterio](https://rasterio.readthedocs.io/), either alone or in combination with async-geotiff.
- For interactive visualization, see [Lonboard](https://developmentseed.org/lonboard/).
- For the raw-bytes layer beneath async-geotiff, see [obstore](https://developmentseed.org/obstore/).
- For generic TIFF reading (not specifically COGs), drop to [async-tiff](https://github.com/developmentseed/async-tiff).
