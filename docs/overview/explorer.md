# Planetary Computer Explorer

```{image} images/explorer-docs.jpg
:height: 500
:name: Planetary Computer Explorer screenshot

```

The [Planetary Computer Explorer][1] allows you to search datasets from our
catalog and visualize the results individually and as mosaics on a map. Many of
the datasets on the Planetary Computer are updated repeatedly over time, with
data items overlapping geographically. Finding the right subset can be a time
consuming process using programmatic tools, with a slow search-render-iterate
feedback loop. The Explorer was designed to allow users to quickly find and
visualize data, and easily recreate their searches in an analytic environment
like our [Hub][pc-docs-hub].

Additionally, it's a great tool for casual browsing to get more familiar with
datasets, their spatiotemporal range, and to understand what types of
features are visible at their available pixel resolution.

## Selecting datasets

Datasets that are available in the Explorer can be selected in the top dropdown,
which is grouped by category.

```{image} images/explorer-ds.jpg
:height: 200
:name: Planetary Computer Explorer dataset selection
```

If you're switching between datasets, you may be looking at an area of the world
that isn't covered by the new dataset. Look for a notice to direct you to the
valid extent.

Datasets can also be opened in the Explorer directly from their
[catalog][pc-catalog] page. These buttons will launch the Explorer at a
location that has data availability and an interesting visualization.

```{image} images/explorer-launch.jpg
:height: 300
:name: Planetary Computer Explorer catalog selection
```

After selecting a dataset, a pre-configured query and appropriate rendering
options are automatically selected to get you started. Many datasets have
several options for both, while others are best represented by a single query
and rendering option. Customizing both of these presets are on our roadmap.
While using the Explorer, the URL in your web browser will contain the relevant
selections, and can be bookmarked or shared.

Currently, only datasets with GeoTiff data assets are available in the Explorer,
but support for additional formats is planned.

## Viewing results

An initial list of items matching the pre-configured search are listed in the
Explorer sidebar. These items represent the assets that are also used in the map
mosaic. Hovering over an item in the list will highlight the footprint of that
item in the list, so you can see how it contributes to the mosaic. Depending on
the footprint size and the map zoom level, only a portion of the item may be
represented. To see the full item rendered on the map, click the result item to
open it's detail view. On the detail view, you have access to all the item's
metadata fields and a list of all the assets that it contains, including the
keys needed to access them from the [Planetary Computer STAC API][pc-docs-api].

You'll also see a larger preview image using the currently selected rendering
option. To see a complete representation of the item on the map, click the small
map icon under the preview image. This will toggle the map view to show only the
single item on the map. Browse and zoom around, when you return to the detail
list, you will return to your original viewport and search results.

```{image} images/explorer-item.png
:height: 500
:name: Planetary Computer Explorer item screenshot
```

Depending on how restrictive your query is, or the general availability of
a dataset in a certain area, they may be "gaps" in the map layer. Since this is
a mosaicked view, that is expected. Similarly, for imagery datasets, the images
stitched together may be from different days, under different weather
conditions, and won't necessarily be a seamless mosaic.

### Rendering options

The Explorer is pre-configured with appropriate rendering options for each asset
in a dataset. For items with multiple assets, each representing a distinct data
variable, each rendering option will be a single asset with an appropriate color
map applied. For example, [Harmonized Global Biomass][hgb] has four assets, each
representing a different measure of stored carbon. Imagery datasets on the other
hand, list various rendering options that combine bands into well known RGB
interpretations or expressions, like false color or NDVI. To see a description of the
selected rendering option, click the info button next to the search results.

```{image} images/explorer-queryinfo.png
:height: 500
:name: Planetary Computer Explorer query info
```

### Working with results in the Hub

Finding and visualizing data items is likely only the first step in your data
analysis workflow. The Explorer provides two options to move your search results
into a compute environment like the [Planetary Computer Hub][pc-docs-hub]. By
clicking "Explore results in the Hub" under the search results, you can generate
a Python snippet to recreate your exact search, covering the map
viewport which can be copied and launched into a new Hub notebook:

```{image} images/explorer-hub.png
:height: 500
:name: Planetary Computer Explorer hub code
```

Or if you're interested in working with a single item you've found, you can
generate a Python snippet by clicking the "code" (`{ }`) button that will load
that single item up in the Hub:

```{image} images/explorer-item-hub.png
:height: 500
:name: Planetary Computer Explorer hub item code
```

Since our data and APIs are accessible to anyone with or without a Hub account,
these snippets can be run in other Python compute environments. Please refer to
our [data access documentation][pc-docs-sas] for more details.

## Coming soon

This is just the initial release of the Explorer. Upcoming features include:

- Legends for scaled and categorical data
- Fully customizable query parameters, including date range, cloud cover, and other attributes
- Visualization support for Zarr-backed datasets
- Hub integration to build queries and visualize search results in a notebook
- Loading multiple dataset search results as map layers

Watch for future announcements, and please [be in
touch](mailto:planetarycomputer@microsoft.com) with feedback or questions.

[1]: https://planetarycomputer.microsoft.com/explore
[pc-docs-hub]: https://planetarycomputer.microsoft.com/docs/overview/environment
[pc-docs-api]: https://planetarycomputer.microsoft.com/docs/quickstarts/reading-stac/
[pc-docs-sas]: https://planetarycomputer.microsoft.com/docs/concepts/sas/
[pc-catalog]: https://planetarycomputer.microsoft.com/catalog
[hgb]: https://planetarycomputer.microsoft.com/dataset/hgb
