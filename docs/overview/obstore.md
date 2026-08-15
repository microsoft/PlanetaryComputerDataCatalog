# Reading Planetary Computer data with obstore

[obstore](https://developmentseed.org/obstore/) is a Python library for reading and writing cloud object stores through a single, unified API that works the same across Azure Blob, Amazon S3, and Google Cloud Storage. Using obstore, Planetary Computer SAS tokens refresh automatically, async I/O is built in, and the same store you build for reading bytes can be handed to higher-level libraries like [async-geotiff](https://github.com/developmentseed/async-geotiff), [Lonboard](https://developmentseed.org/lonboard/), and [zarr-python](https://zarr.dev/) without re-authenticating.

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

3. Build a store using that provider.

   ```python
   from obstore.store import AzureStore

   store = AzureStore(credential_provider=provider)
   ```

   The credentials obstore fetches grant read access to the *entire container*, not just this one file. `from_asset` simply points the store's prefix at the asset's blob path — which is why the reads below pass an empty path (`""`). To read across the container, see [Open the whole container](#open-the-whole-container) below.

## Read bytes from the store

Once you have a working store, obstore exposes three read methods. Call them directly on the store.

1. **Read a byte range.** Useful when you only need part of the file. For example, the first ~16 KB of a Cloud Optimized GeoTIFF.

   ```python
   header = store.get_range("", start=0, end=16384)
   ```

2. **Read multiple byte ranges in a single request.** Cuts round-trip latency when you need several non-contiguous slices of the same file (e.g. multiple COG tiles). obstore coalesces adjacent ranges into a single network request for you.

   ```python
   ranges = store.get_ranges("", starts=[0, 65536], ends=[16384, 81920])
   ```

3. **Read the entire file.** `store.get` returns a result you can iterate to stream the body in chunks; call `.bytes()` to collect it into one buffer. Avoid collecting large rasters — range reads and async (below) exist for that.

   ```python
   buf = store.get("").bytes()
   ```

## Open the whole container

`from_asset` is the quickest path for a single scene. When you want to read or list many objects, build the store against the container root instead, then pass full blob paths.

```python
container_store = AzureStore(
    account_name="naipeuwest",
    container_name="naip",
    credential_provider=PlanetaryComputerCredentialProvider(
        "https://naipeuwest.blob.core.windows.net/naip/"
    ),
)

buf = container_store.get("v002/mt/2023/40086/m_4008601_se_12_060_20230621.tif").bytes()
```

## Run reads in parallel

For multi-file workloads — building a mosaic, or fetching every band across every scene in an AOI — running reads concurrently is much faster than one at a time. obstore exposes async equivalents of every read method (`get_async`, `get_range_async`, `get_ranges_async`), which you compose with `asyncio.gather`.

Async needs its own credential provider, `PlanetaryComputerAsyncCredentialProvider`, backed by `aiohttp` instead of `requests`. It takes the same `from_asset()` constructor.

```python
import asyncio
from obstore.auth.planetary_computer import PlanetaryComputerAsyncCredentialProvider

items = list(catalog.search(collections=["naip"], max_items=8).items())
stores = [
    AzureStore(
        credential_provider=PlanetaryComputerAsyncCredentialProvider.from_asset(
            item.assets["image"]
        )
    )
    for item in items
]

headers = await asyncio.gather(
    *[store.get_range_async("", start=0, end=16384) for store in stores]
)
```

To read many ranges *within a single file*, don't fan out one request per range. Use `get_ranges_async`, which coalesces adjacent ranges into a single network request under the hood:

```python
tiles = await stores[0].get_ranges_async(
    "", starts=[0, 65536, 131072], ends=[65536, 131072, 196608]
)
```

## List objects across a container

To enumerate objects under a prefix ("show me every NAIP scene in Montana in 2023"), call `list` on the `container_store` from above.

```python
for batch in container_store.list(prefix="v002/mt/2023/"):
    for entry in batch:
        print(entry["path"], entry["size"])
```

## Hand the store to other libraries

Any library that accepts an [obspec](https://github.com/developmentseed/obspec)-compatible store reads through your authenticated connection without re-doing auth. Open the same NAIP scene as a Cloud Optimized GeoTIFF using [async-geotiff](https://github.com/developmentseed/async-geotiff):

```python
from async_geotiff import GeoTIFF

async_store = AzureStore(
    credential_provider=PlanetaryComputerAsyncCredentialProvider.from_asset(asset)
)
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

provider = PlanetaryComputerCredentialProvider.from_asset(asset)
store = AzureStore(credential_provider=provider)
data = store.get("").bytes()
```

obstore handles re-signing on expiry, talks to Azure Blob Storage directly instead of routing through HTTP via fsspec, and exposes async I/O for parallel reads — all without changing your auth code per request.

## Use the same code against other clouds

obstore implements the [obspec](https://github.com/developmentseed/obspec) protocol, so the same read and write calls work against S3 or GCS. Any library built on obspec inherits this portability automatically.

```python
from obstore.store import S3Store

s3_store = S3Store(bucket="my-bucket", region="us-west-2")
buf = s3_store.get("path/to/object").bytes()
```

