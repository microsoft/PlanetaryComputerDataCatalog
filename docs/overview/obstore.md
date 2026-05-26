# Reading Planetary Computer data with obstore

[obstore](https://developmentseed.org/obstore/) is a Python library for reading and writing cloud object stores (Azure Blob, Amazon S3, Google Cloud Storage) directly through their native APIs. Using obstore, Planetary Computer SAS tokens refresh automatically, async I/O is built in, and the same store you build for reading bytes can be handed to higher-level libraries like [async-geotiff](https://github.com/developmentseed/async-geotiff), [Lonboard](https://developmentseed.org/lonboard/), and [zarr-python](https://zarr.dev/) without re-authenticating.

A companion notebook walks through every step end-to-end with live timings. [Open in Planetary Computer Hub](https://pccompute.westeurope.cloudapp.azure.com/compute/hub/user-redirect/git-pull?repo=https://github.com/microsoft/PlanetaryComputerExamples&urlpath=lab/tree/PlanetaryComputerExamples/quickstarts/obstore.ipynb&branch=main)

## Install obstore

obstore works in any Python project. To get started, install obstore alongside `pystac-client` (for searching the Planetary Computer's STAC API) and the HTTP libraries that power its [credential providers](https://developmentseed.org/obstore/latest/authentication/#credential-providers):

```bash
uv add obstore pystac-client requests aiohttp aiohttp_retry
```

`requests` powers the sync credential provider; `aiohttp` and `aiohttp_retry` power the async one. Install both unless you know you only need one path.

## Connect to a Planetary Computer asset

The most common starting point is a STAC asset returned from a search. obstore's `PlanetaryComputerCredentialProvider` reads the asset's blob URL and handles SAS token acquisition and refresh for you.

1. Open the Planetary Computer STAC catalog and pick a scene to work with.

   ```python
   import pystac_client
   from obstore.auth.planetary_computer import PlanetaryComputerCredentialProvider

   catalog = pystac_client.Client.open(
       "https://planetarycomputer.microsoft.com/api/stac/v1"
   )
   item = next(catalog.search(collections=["naip"], max_items=1).items())
   asset = item.assets["image"]
   ```

2. Build a credential provider from the asset.

   ```python
   provider = PlanetaryComputerCredentialProvider.from_asset(asset)
   ```

3. Build a store using that provider. The store is your reusable connection to that asset.

   ```python
   from obstore.store import AzureStore

   store = AzureStore(credential_provider=provider)
   ```

## Read bytes from the store

Once you have a working store, obstore exposes three read operations that map directly to native Azure Blob API calls.

1. **Read a byte range.** Useful when you only need part of the file. For example, the first ~16 KB of a Cloud Optimized GeoTIFF. 

   ```python
   import obstore

   header = obstore.get_range(store, "", start=0, end=16384)
   ```

2. **Read multiple byte ranges in a single request.** Cuts round-trip latency when you need several non-contiguous slices of the same file (e.g. multiple COG tiles).

   ```python
   ranges = obstore.get_ranges(
       store, "", starts=[0, 65536], ends=[16384, 81920]
   )
   ```

3. **Read the entire file.** Avoid this for large rasters. Range reads and async (below) exist to avoid this scenario.

   ```python
   buf = obstore.get(store, "").bytes()
   ```

## Run reads in parallel

For multi-file workloads like building a mosaic or fetching all bands across all scenes in an AOI, making concurrent requests is faster. obstore exposes async equivalents of every read function (`get_async`, `get_range_async`, etc.) that you can compose with `asyncio.gather`.

Async needs its own credential provider class, `PlanetaryComputerAsyncCredentialProvider`, backed by `aiohttp` instead of `requests`. Same `from_asset()` signature.

```python
import asyncio
from obstore.auth.planetary_computer import PlanetaryComputerAsyncCredentialProvider

async_provider = PlanetaryComputerAsyncCredentialProvider.from_asset(asset)
async_store = AzureStore(credential_provider=async_provider)

async def fetch(start, end):
    return await obstore.get_range_async(async_store, "", start=start, end=end)

results = await asyncio.gather(*[fetch(i * 4096, (i + 1) * 4096) for i in range(8)])
```

This is typically 3–5× faster in practice.

## List objects across a container

To enumerate objects under a prefix ("show me every NAIP scene in Montana in 2023"), build a fresh provider against the container URL instead.

```python
container_provider = PlanetaryComputerCredentialProvider(
    "https://naipeuwest.blob.core.windows.net/naip/"
)
container_store = AzureStore(
    account_name="naipeuwest",
    container_name="naip",
    credential_provider=container_provider,
)

for batch in obstore.list(container_store, prefix="v002/mt/2023/"):
    for entry in batch:
        print(entry["path"], entry["size"])
```

## Hand the store to other libraries

Any library that accepts an [obspec](https://github.com/developmentseed/obspec)-compatible store reads through your authenticated connection without re-doing auth. Open the same NAIP scene as a Cloud Optimized GeoTIFF using async-geotiff:

```python
from async_geotiff import GeoTIFF

geotiff = await GeoTIFF.open("", store=async_store)
print(geotiff.transform, geotiff.crs.name)
```

[zarr-python](https://zarr.dev/) works through a thin adapter (`zarr.storage.ObjectStore` wraps your obstore store). See the [obstore Zarr example](https://developmentseed.org/obstore/latest/examples/zarr/) for a Planetary Computer Daymet walkthrough.

## Migrate from `planetary_computer.sign()` + fsspec

If you're updating an existing project, here's the side-by-side. The old pattern:

```python
import planetary_computer
import fsspec

signed = planetary_computer.sign(asset.href)
with fsspec.open(signed) as f:
    data = f.read()
```

The obstore equivalent:

```python
from obstore.auth.planetary_computer import PlanetaryComputerCredentialProvider
from obstore.store import AzureStore
import obstore

provider = PlanetaryComputerCredentialProvider.from_asset(asset)
store = AzureStore(credential_provider=provider)
data = obstore.get(store, "").bytes()
```

obstore handles re-signing on expiry, talks to Azure's native blob API instead of routing through HTTP via fsspec, and exposes async I/O for parallel reads — all without changing your auth code per request.

## Use the same code against other clouds

obstore implements the [obspec](https://github.com/developmentseed/obspec) protocol, so the same read and write calls work against S3 or GCS. Any library built on obspec inherits this portability automatically.

```python
from obstore.store import S3Store

s3_store = S3Store(bucket="my-bucket", region="us-west-2")
buf = obstore.get(s3_store, "path/to/object").bytes()
```

