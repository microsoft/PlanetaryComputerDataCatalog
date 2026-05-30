# Reading Planetary Computer COGs with async-geotiff

[async-geotiff](https://github.com/developmentseed/async-geotiff) is a Python Cloud Optimized GeoTIFF reader with no GDAL dependency. The core is Rust, image decoding runs in a thread pool, buffers are zero-copy, and every API is fully type-hinted. Use it when you want async I/O for pixel-level analysis without putting GDAL on the system.

A companion notebook walks through every step end-to-end. [Open in Planetary Computer Hub](https://pccompute.westeurope.cloudapp.azure.com/compute/hub/user-redirect/git-pull?repo=https://github.com/microsoft/PlanetaryComputerExamples&urlpath=lab/tree/PlanetaryComputerExamples/quickstarts/async-geotiff.ipynb&branch=main)

## Install async-geotiff

```bash
uv add async-geotiff obstore planetary-computer pystac-client
```

`async-geotiff` is the user-facing library. `async-tiff` is the lower-level Rust core — use it directly only if you're building library infrastructure on top.

## What async-geotiff is *not*

- No resampling.
- No warping or reprojection.
- No automatic overview selection.

For any of those, read a window with async-geotiff, then hand the array to [rasterio](https://rasterio.readthedocs.io/) via an in-memory file. The split keeps the reader fast and the warping stack pluggable.

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
    max_items=1,
).items())

asset = item.assets["B04"]
```

`planetary_computer.sign_inplace` signs every asset href as the search returns.

## Build an authenticated obstore store

async-geotiff reads bytes through an [obstore](https://developmentseed.org/obstore/) store. `PlanetaryComputerCredentialProvider` handles SAS token acquisition and refresh — give it a signed asset and it figures out the account, container, and prefix:

```python
from obstore.auth.planetary_computer import PlanetaryComputerCredentialProvider
from obstore.store import AzureStore

provider = PlanetaryComputerCredentialProvider.from_asset(asset, async_=True)
store = AzureStore(credential_provider=provider)
```

Set your Planetary Computer subscription key via the `PC_SDK_SUBSCRIPTION_KEY` environment variable, or pass `subscription_key=` to the provider.

## Open the COG and inspect metadata

```python
from async_geotiff import GeoTIFF

geotiff = await GeoTIFF.open(asset.href, store=store)

print(geotiff.transform)   # affine transform
print(geotiff.crs)         # PyProj CRS
print(geotiff.nodata)
print(geotiff.overviews)   # finest → coarsest
```

The header read is a single range request — no pixel data is fetched yet. This is the same pattern the [obstore tutorial](./obstore.md) demonstrates, just behind a higher-level API.

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

- `array.data` — 3D NumPy array, band-first (`(bands, rows, cols)`).
- `array.mask` — boolean mask, `True` where nodata.
- `array.transform` — affine transform for the windowed region.
- `array.as_masked()` — convert to `numpy.ma.MaskedArray`.

> **📷 Screenshot:** A Jupyter cell showing the `Array` repr alongside a small `matplotlib.imshow()` preview of `array.data[0]`. Anchors the reader on what they just loaded.

## Visualize the scene with Lonboard

For an interactive map view of the same Sentinel-2 item, hand the signed STAC item to [Lonboard](https://developmentseed.org/lonboard/):

```python
from lonboard import Map
from lonboard.experimental import RasterLayer

Map(RasterLayer.from_stac([item]))
```

> **📷 Screenshot:** Side-by-side: the matplotlib preview of a single window, and the Lonboard map of the full scene. Shows the two surfaces playing together.

## Walk the tile pyramid

`generate_tms()` exposes the COG as a TileMatrixSet via [Morecantile](https://developmentseed.org/morecantile/):

```python
from async_geotiff import generate_tms

tms = generate_tms(geotiff)
tile = await tms.tile(x=1234, y=5678, z=12)
```

Useful when you want web-mercator tiles for a custom tile server.

## Read in parallel

Each `read()` is independent. Fire many at once with `asyncio.gather` — async-geotiff issues range requests in parallel and decodes them on the Rust thread pool:

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

## Reach for something else when…

For resampling, reprojection, or warping, hand the array to [rasterio](https://rasterio.readthedocs.io/) — async-geotiff deliberately doesn't do those. For interactive visualization, see [Lonboard](https://developmentseed.org/lonboard/). For the raw-bytes layer beneath async-geotiff, see [obstore](https://developmentseed.org/obstore/). For library authors building on the Rust core, drop to [async-tiff](https://github.com/developmentseed/async-tiff).
