# Changelog

Notable changes to the Planetary Computer, January 2023 release.

## New features

This release brings a new datasets and features, including:

- [Vector tile rendering](vector-tile-rendering) in the Explorer
- [New datasets and updates](new-datasets-jan-23)

See [previous changelogs](docs/changelogs/history.md) for notes about previous releases.


(vector-tile-rendering)=
### Vector Rendering

The Planetary Computer Data Catalog contains assets in a variety of common
geospatial formats, but until now the Explorer has only supported visualizing
raster data. With this release, we're introducing support for vector rendering
for collections with GeoParquet data assets. We're showcasing this feature with
the [MS Buildings](https://planetarycomputer.microsoft.com/dataset/ms-buildings)
dataset, which contains over 1 billion building footprints across the world.

For this, and future, GeoParquet vector datasets you'll find a new
[collection-level asset](https://github.com/radiantearth/stac-spec/blob/master/collection-spec/collection-spec.md#asset-object)
with a role of `tilejson` that contains a [TileJSON](https://github.com/mapbox/tilejson-spec) endpoint that can be used to render the data as [Mapbox Vector Tiles](https://docs.mapbox.com/data/tilesets/guides/vector-tiles-standards/).

[Use the Explorer](https://planetarycomputer.microsoft.com/explore?c=-77.7333%2C39.4660&z=5.05&v=2&d=ms-buildings&m=Global&r=Default&s=true%3A%3A100%3A%3Atrue&sr=desc&ae=0)
to quickly visualize the geographic coverage of the dataset:

```{image} images/docs-explorer-vector-buildings-us-extent.png
:height: 500
:name: MS Buildings dataset extent in the Eastern US
:class: no-scaled-link
```

Or overlay it with other layers to see how it fits into the broader context of the world. For example, to see villages in southern Nigeria that have very low nighttime light intensity:

```{image} images/docs-explorer-vector-buildings-at-light.png
:height: 500
:name: MS Buildings dataset nighttime lights in Nigeria
:class: no-scaled-link
```

Here's an example of building vectors rendered with a Sentinel-2 imagery product:

<video controls style="height: 400px;">
  <source src="https://ai4edatasetspublicassets.blob.core.windows.net/assets/pc_video/vector-tile-ms-buildings-feature.mp4" type="video/mp4" />
  <p>
    Your browser doesn't support HTML video. Here is a
    <a href="https://ai4edatasetspublicassets.blob.core.windows.net/assets/pc_video/vector-tile-ms-buildings-feature.mp4">link to the video</a> instead.
  </p>
</video>

<hr/>

(new-datasets-jan-23)=
## New datasets and updates

This release includes several new datasets:

### ESA Climate Change Initiative Land Cover (CCI LC)

[GOES-R Lightning Detection](https://planetarycomputer.microsoft.com/dataset/goes-glm):
Continuous lightning detection over the Western Hemisphere from the Geostationary Lightning Mapper (GLM) instrument.

```{image} images/docs-data-glm_c.jpg
:width: 558
:name: GLM screenshot
:class: no-scaled-link
```

### NOAA Climate Normals


East US

### Cropland Data Layer

[NOAA Monthly NClimGrid](https://planetarycomputer.microsoft.com/dataset/noaa-nclimgrid-monthly): Monthly Climate Gridded dataset with data on temperature and precipitation.

<img style="height: 300px;" src="https://ai4edatasetspublicassets.azureedge.net/assets/pc_video/docs-data-noaa-nclimgrid-monthly.gif" alt="Timelapse avg temp nclimgrid"/>

### USGS LCMAP

[Denver Regional Council of Governments Land Use Land Cover](https://planetarycomputer.microsoft.com/dataset/drcog-lulc): 1-ft resolution land use / land cover dataset around Denver, Colorado.

```{image} images/docs-data-denver-regional_c.jpg
:width: 558
:name: Denver Regional Council of Governments Land Use Land Cover
:class: no-scaled-link
```

### National Wetlands Inventory

[Chesapeake Land Cover (7-class)](https://planetarycomputer.microsoft.com/dataset/chesapeake-lc-7): 1-meter land cover data product for the entire Chesapeake Bay watershed with a uniform set of 7 land cover classes.

```{image} images/docs-data-chesapeake-7_c.jpg
:width: 558
:name: Chesapeake Land Cover (7-class) thumbnail
:class: no-scaled-link
```

[Chesapeake Land Cover (13-class)](https://planetarycomputer.microsoft.com/dataset/chesapeake-lc-13): 1-meter land cover data product for the entire Chesapeake Bay watershed with 13 varying land cover classes.

```{image} images/docs-data-chesapeake-13_c.jpg
:width: 558
:name: Chesapeake Land Cover (13-class) thumbnail
:class: no-scaled-link
```

[Chesapeake Land Use](https://planetarycomputer.microsoft.com/dataset/chesapeake-lu): 1-meter land use data product for the entire Chesapeake Bay watershed.

```{image} images/docs-data-chesapeake-lu_c.jpg
:width: 558
:name: Chesapeake Land Use thumbnail
:class: no-scaled-link
```

(dataset-updates-jan-23)=
### Dataset Updates

#### GOES
- GOES-18 in the Cloud Moisture Index (CMI) product
- Entries for the GOES-R FDC, LST, RRQE, and SST datasets
- New render config for viewing GOES CMI at night in the Explorer

#### Others

- Terraclimate update
- NOAA NWM
- ASTER footprints
- Collections now have an `msft:region` property
- MS Buidings now have a collection levle asset of vector tiles, which can be vized through the feature mentioned abvoe

## Notices for future release

- Breaking titiler change
