# Querying Planetary Computer STAC items with rustac

[rustac](https://github.com/stac-utils/rustac-py) is a Rust-powered STAC toolkit for Python. The Planetary Computer publishes a GeoParquet snapshot of every collection's STAC items, and rustac reads it through a bundled DuckDB engine. Instead of downloading the whole file and filtering in pandas, you push spatial, temporal, and property filters down to the Parquet and read back only the items that match.

Reach for rustac when you are scanning across many items at once and want only the matches pulled into Python. For small or up-to-date queries, the live STAC API through `pystac-client` is a better fit; to ask analytical questions or join the catalog against other datasets, see the [DuckDB tutorial](./duckdb.md).

> Note on coverage: the Sentinel-2 GeoParquet snapshot is a point-in-time export covering 2015-07 through 2018-10 (about 6.4 million items), not the live archive. Use it for bulk historical analysis. For current acquisitions, query the live STAC API with `pystac-client`.

A companion notebook runs every step end-to-end. [Open in Planetary Computer Hub](https://pccompute.westeurope.cloudapp.azure.com/compute/hub/user-redirect/git-pull?repo=https://github.com/microsoft/PlanetaryComputerExamples&urlpath=lab/tree/PlanetaryComputerExamples/quickstarts/rustac.ipynb&branch=main)

## Install rustac

```bash
uv add 'rustac[arrow]' pystac-client planetary-computer geopandas obstore
```

The `[arrow]` extra pulls in PyArrow for the dataframe handoffs below. rustac ships the DuckDB engine that backs its querying, so there is no separate DuckDB install. The package was named `stacrs` until April 2025; older examples may import it under that name.

## Find the GeoParquet snapshot

Every Planetary Computer collection carries a collection-level `geoparquet-items` asset that points at its STAC-items snapshot.

```python
import pystac_client

catalog = pystac_client.Client.open("https://planetarycomputer.microsoft.com/api/stac/v1")
asset = catalog.get_collection("sentinel-2-l2a").assets["geoparquet-items"]
print(asset.href)  # abfs://items/sentinel-2-l2a.parquet
```

The href resolves to a directory on the `pcstacitems` storage account, holding monthly `part-NNNN` partition files. Reading from the account needs a Shared Access Signature (SAS) token.

## List the partition files

List the partitions with [obstore](https://developmentseed.org/obstore/), which signs Planetary Computer blobs through its own credential provider. Each filename embeds the partition's date range, which the query section below uses to skip partitions.

```python
from obstore.auth.planetary_computer import PlanetaryComputerCredentialProvider
from obstore.store import AzureStore

store = AzureStore(
    credential_provider=PlanetaryComputerCredentialProvider(
        "https://pcstacitems.blob.core.windows.net/items"
    )
)
partitions = [
    meta["path"]
    for stream in store.list(prefix="sentinel-2-l2a.parquet")
    for meta in stream
    if "/part-" in meta["path"]
]
len(partitions)  # about 136
```

## Authenticate the DuckDB engine

The high-level `rustac.search()` coroutine cannot pass Azure credentials, so it fails against `abfs://` paths. Use `rustac.DuckdbClient` instead and configure its connection once. Fetch a container SAS from the Planetary Computer token API, register an Azure secret, and switch the Azure transport to curl.

```python
import json
import urllib.request
import rustac

sas = json.load(urllib.request.urlopen(
    "https://planetarycomputer.microsoft.com/api/sas/v1/token/pcstacitems/items"
))["token"]

client = rustac.DuckdbClient()
client.execute("INSTALL azure; LOAD azure; SET azure_transport_option_type = 'curl';")
client.execute(
    "CREATE SECRET pc (TYPE azure, PROVIDER config, ACCOUNT_NAME 'pcstacitems', "
    f"CONNECTION_STRING 'BlobEndpoint=https://pcstacitems.blob.core.windows.net;SharedAccessSignature={sas}')"
)
```

The `azure_transport_option_type = 'curl'` line is not optional. Without it, DuckDB's default Azure transport fails with an opaque SSL CA-certificate error. The SAS expires after about an hour, so long-running jobs re-fetch it from the token API.

## Query the snapshot

Point `search()` at the snapshot glob and pass the filters you want pushed into the read, so only matching rows cross the network:

```python
items = client.search(
    "az://items/sentinel-2-l2a.parquet/*.parquet",
    collections=["sentinel-2-l2a"],
    bbox=[-122.7, 45.5, -122.6, 45.6],
    datetime="2017-07-01/2017-08-01",
)
print(len(items))  # a handful of Portland scenes
```

The glob (`/*.parquet`) spans the monthly partition files. `search()` returns a list of STAC item dictionaries. (`DuckdbClient.search` is synchronous, so there is no `await`; this is a search over every partition file, about 136, with no index, so expect it to take a minute or two on the first call.)

## Filter on space, time, and properties

`search()` accepts the STAC query parameters you would expect, including CQL2-JSON property filters:

```python
items = client.search(
    "az://items/sentinel-2-l2a.parquet/*.parquet",
    collections=["sentinel-2-l2a"],
    bbox=[-122.7, 45.5, -122.6, 45.6],
    datetime="2017-06-01/2017-09-01",
    filter={"op": "<", "args": [{"property": "eo:cloud_cover"}, 20]},
)
```

## Narrow the glob to skip partitions

Each partition filename embeds its date range (`part-NNNN_<start>_<end>.parquet`), so you can point the glob at only the partitions a query needs instead of scanning every one. Narrowing a 2017 query to the 2017 partitions returns the same scenes several times faster:

```python
items = client.search(
    "az://items/sentinel-2-l2a.parquet/part-*_2017-*.parquet",
    collections=["sentinel-2-l2a"],
    bbox=[-122.7, 45.5, -122.6, 45.6],
    datetime="2017-07-01/2017-08-01",
)
```

## Write results without materializing Python objects

For bulk work, skip the round-trip through Python dictionaries. `search_to_arrow` takes the same arguments as `search` and returns an Arrow table. It is backed by `arro3` (rustac's Arrow runtime), so adopt it into PyArrow with `pa.table(...)`, a zero-copy hand-off, before writing it to a new Parquet file:

```python
import pyarrow as pa
import pyarrow.parquet as pq

table = pa.table(client.search_to_arrow(
    "az://items/sentinel-2-l2a.parquet/*.parquet",
    collections=["sentinel-2-l2a"],
    bbox=[-122.7, 45.5, -122.6, 45.6],
    datetime="2017-07-01/2017-08-01",
))
pq.write_table(table, "portland-2017.parquet")
```

## Bridge to GeoPandas

To analyze results as a GeoDataFrame, convert the Arrow table:

```python
import geopandas

gdf = geopandas.GeoDataFrame.from_arrow(table)
gdf = gdf.set_crs(4326)  # the snapshot geometries are lon/lat, but the CRS is not carried on the Arrow table
```

rustac also exposes `rustac.to_arrow(items)` and `rustac.from_arrow(...)` for converting between item lists and Arrow tables.

## From metadata to pixels

A search returns item metadata, not imagery. To read the actual rasters, pull asset hrefs from the results, sign them, and hand them to a reader:

```python
import planetary_computer

href = planetary_computer.sign(items[0]["assets"]["B04"]["href"])
```

Pass that signed href to [obstore](./obstore.md) for raw bytes or to [async-geotiff](./async-geotiff.md) for windowed reads.

## Run the notebook

Every step above runs end-to-end in the companion notebook. [Open in Planetary Computer Hub](https://pccompute.westeurope.cloudapp.azure.com/compute/hub/user-redirect/git-pull?repo=https://github.com/microsoft/PlanetaryComputerExamples&urlpath=lab/tree/PlanetaryComputerExamples/quickstarts/rustac.ipynb&branch=main)
