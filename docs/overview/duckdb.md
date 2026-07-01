# Bringing Planetary Computer data into DuckDB

[DuckDB](https://duckdb.org/) reads the Planetary Computer's GeoParquet snapshots as ordinary SQL tables. Point it at a collection's snapshot and you can filter on space, time, and properties, join it against other datasets, and export the result, all in SQL and without downloading the whole file first.

[rustac](./rustac.md) and `pystac-client` retrieve STAC items into Python. DuckDB instead treats the same snapshots as queryable data. This tutorial reads the Sentinel-2 snapshot, narrows it to a handful of cloud-free scenes over Portland, joins those scenes against building footprints, and writes the result out.

Reach for DuckDB when your question is analytical, needs a join, or wants SQL output. To pull items into Python without writing SQL, use [rustac](./rustac.md) or `pystac-client`; for the imagery behind the metadata, hand asset URLs to [async-geotiff](./async-geotiff.md).

> Note on coverage: the Sentinel-2 GeoParquet snapshot covers 2015-07 through 2018-10, not the live archive. The examples below use 2017 dates. For current data, query the live STAC API.

A companion notebook runs every step end-to-end. [Open in Planetary Computer Hub](https://pccompute.westeurope.cloudapp.azure.com/compute/hub/user-redirect/git-pull?repo=https://github.com/microsoft/PlanetaryComputerExamples&urlpath=lab/tree/PlanetaryComputerExamples/quickstarts/duckdb.ipynb&branch=main)

## Install DuckDB

```bash
uv add duckdb pandas
```

`pandas` backs the `.df()` calls below; everything else is a DuckDB extension. From the Python client:

```python
import duckdb

con = duckdb.connect()
con.execute("INSTALL spatial; LOAD spatial; INSTALL azure; LOAD azure;")
```

`spatial` gives you `ST_*` functions and native GeoParquet reads. Without it, geometry columns come back as opaque blobs. `azure` handles the storage authentication below. Use the Python client rather than the CLI so you can refresh the SAS token mid-session.

## Authenticate to the Planetary Computer

DuckDB's Azure extension reads signed Planetary Computer blobs directly. Fetch a container SAS from the token API, register a secret, and switch the Azure transport to curl.

```python
import json
import urllib.request

def container_sas(account, container):
    url = f"https://planetarycomputer.microsoft.com/api/sas/v1/token/{account}/{container}"
    return json.load(urllib.request.urlopen(url))["token"]

sas = container_sas("pcstacitems", "items")
con.execute("SET azure_transport_option_type = 'curl';")
con.execute(
    "CREATE SECRET pc (TYPE azure, PROVIDER config, ACCOUNT_NAME 'pcstacitems', "
    f"CONNECTION_STRING 'BlobEndpoint=https://pcstacitems.blob.core.windows.net;SharedAccessSignature={sas}', "
    "SCOPE 'az://items')"
)
```

Two important details:

- `azure_transport_option_type = 'curl'` is required. The default transport fails with an opaque SSL CA-certificate error.
- The `SCOPE` matters as soon as you add a second account (the join below). DuckDB routes each read to the secret whose scope is the longest matching prefix. Without scopes, a second Azure secret shadows the first and every read fails to authenticate.

## Read STAC-GeoParquet as a table

The snapshot is a directory of monthly partition files. Glob them and query as you would any table, pushing your spatial, temporal, and property filters into the read:

```python
S2 = "az://items/sentinel-2-l2a.parquet/*.parquet"

con.execute(f"""
    SELECT id, datetime, "eo:cloud_cover"
    FROM read_parquet('{S2}')
    WHERE datetime BETWEEN '2017-07-01' AND '2017-08-01'
      AND "eo:cloud_cover" < 20
      AND ST_Intersects(geometry, ST_MakeEnvelope(-122.7, 45.5, -122.6, 45.6))
    ORDER BY "eo:cloud_cover"
""").df()
```

`datetime` is a `TIMESTAMP WITH TIME ZONE`. Predicates push down to Parquet row-group statistics, and the bbox column accelerates spatial filters, so DuckDB skips partitions and row groups that cannot match. The first query still spends some time scanning every partition (about 136); later queries against the same connection are quicker.

## Join against building footprints

The point of pulling the catalog into SQL is to join it against other data. Here, scenes meet [Microsoft Building Footprints](https://planetarycomputer.microsoft.com/dataset/ms-buildings).

The footprints live on a different storage account, so they need their own scoped secret. They are not public, despite being a widely used open dataset, which is exactly why the `SCOPE` from the auth step matters: each read routes to the secret whose scope is the longest matching prefix.

```python
bf_sas = container_sas("bingmlbuildings", "footprints")
con.execute(
    "CREATE SECRET buildings (TYPE azure, PROVIDER config, ACCOUNT_NAME 'bingmlbuildings', "
    f"CONNECTION_STRING 'BlobEndpoint=https://bingmlbuildings.blob.core.windows.net;SharedAccessSignature={bf_sas}', "
    "SCOPE 'az://footprints')"
)

# the footprints are partitioned by quadkey; quadkey 21230223 covers Portland
BF = ("az://footprints/delta/2023-04-25/ml-buildings.parquet/"
      "RegionName=UnitedStates/quadkey=21230223/*.parquet")
```

Now the join: building footprints in a neighborhood, against the cloud-free Sentinel-2 scenes that contain them.

```python
con.execute(f"""
    WITH buildings AS (
        SELECT geometry, meanHeight
        FROM read_parquet('{BF}')
        WHERE ST_Within(geometry, ST_MakeEnvelope(-122.69, 45.51, -122.66, 45.53))
    ),
    scenes AS (
        SELECT id, datetime, geometry
        FROM read_parquet('{S2}')
        WHERE datetime BETWEEN '2017-07-01' AND '2017-09-01'
          AND "eo:cloud_cover" < 20
    )
    SELECT count(*) AS building_scene_pairs,
           count(DISTINCT scenes.id) AS scenes
    FROM buildings JOIN scenes
      ON ST_Intersects(buildings.geometry, scenes.geometry)
""").fetchone()
```

To get the freshest acquisition per building rather than every pair, add a window function over `datetime` partitioned by building and keep the first row.

## Export results

```python
con.execute("COPY (SELECT ...) TO 'portland.parquet' (COMPRESSION zstd)")        # for BI tools
con.execute("COPY (SELECT ...) TO 'portland.geojson' (FORMAT GDAL, DRIVER 'GeoJSON')")  # for viz
```

Flag the geometry encoding when downstream Parquet readers expect a specific GeoParquet version.

## Run the notebook

Every step above runs end-to-end in the companion notebook. [Open in Planetary Computer Hub](https://pccompute.westeurope.cloudapp.azure.com/compute/hub/user-redirect/git-pull?repo=https://github.com/microsoft/PlanetaryComputerExamples&urlpath=lab/tree/PlanetaryComputerExamples/quickstarts/duckdb.ipynb&branch=main)
