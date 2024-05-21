# Accessing Planetary Computer data in QGIS

[QGIS][qgis-home] is a popular open-source desktop GIS application used for
mapping, analysis, and visualization of spatial data. While much of the
Planetary Computer is designed to support [cloud-native][cnative] workflows,
it's easy to use our data in a traditional desktop clients, like QGIS, as well.

## QGIS STAC API Plugin

Since the Planetary Computer metadata API is built on the [STAC](https://stacspec.org/) standard, the easiest way
to search for and add data to QGIS is by using the [STAC API Browser plugin][plugin-url]. Microsoft
supported development of this plugin, with our partners [Kartoza][kartoza], to
make accessing STAC APIs from QGIS easier.

For a general overview on plugin usage, the [official user guide][user-guide].

### Searching for data

Launch the STAC Browser plugin from the Plugin menu or toolbar within the app.
Select the "Microsoft Planetary Computer STAC API" option from the pre-loaded
list of connections, then click "Fetch collections" to see the list of datasets
in the catalog. You can visit the [Planetary Computer Data Catalog][pc-catalog]
to see information about each dataset, including specific temporal and spatial
coverages.

Select one or many collections in the list, and optionally restrict the search
using the filter by date or filter by extent options. If you want to additionally
filter on specific dataset attributes (e.g., cloud cover) you can use the Advanced filter
to add custom [CQL2][cql2] or [STAC-QL][stac-ql] filters. Click the search button to see
the results of your query.

```{image} images/qgis-plugin.png
:height: 500
:name: QGIS STAC API plugin
:class: no-scaled-link
```

The plugin also allows you to search data from other STAC API providers, and is
preloaded with a list of other popular catalogs.

### Working with data

Once you've identified dataset items of interest, you have three ways of interacting with them:

1. _Add the item footprint to your QGIS workspace_. This adds a geojson shape
representing the data item extent on the map and includes all of its metadata
attributes. Use this option to quickly inspect the data without having to load
the full data asset.
2. _Add asset as layer_. You can also add the actual data asset, typically a
Cloud-Optimized GeoTIFF, directly to your QGIS workspace.  This does not
download the asset locally, but rather efficiently fetches the overview layer
for your current zoom layer.
**Note that assets added added as COG layers are signed using the SAS token
mechanism, which expires by default after an hour.** You'll need to re-add the
layer, though we're working on improvements to that workflow in the next version
of the plugin. This option may be slower if you're working with a local QGIS instance.
3. _Download the asset_. The plugin also allows you to download the asset directly, so you can
work with the file itself. Be sure to set your download directory on the Settings tab to a path
located within your home directory, so the data is preserved between launches.

```{image} images/qgis-working-with.png
:height: 500
:name: Working with data in QGIS
:class: no-scaled-link
```

[qgis-home]: https://qgis.org/en/site/about/index.html
[cnative]: https://en.wikipedia.org/wiki/Cloud_native_computing
[plugin-url]: https://stac-utils.github.io/qgis-stac-plugin/
[kartoza]: https://kartoza.com/
[user-guide]: https://stac-utils.github.io/qgis-stac-plugin/user-guide/
[pc-catalog]: https://planetarycomputer.microsoft.com/catalog
[cql2]: https://github.com/radiantearth/stac-api-spec/tree/master/fragments/filter#example-1
[stac-ql]: https://github.com/radiantearth/stac-api-spec/tree/master/fragments/query#stac-api---query-fragment
