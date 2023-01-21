# Changelog

Notable changes to the Planetary Computer, January 2023 release.

## New features

This release brings a new datasets and features, including:

- [Vector tile rendering](vector-tile-rendering) in the Explorer
- [New datasets](new-datasets-jan-23)
- [Dataset updates](dataset-updates-jan-23)

See [previous changelogs](docs/changelogs/history.md) for notes about previous releases.


(vector-tile-rendering)=
### Vector Tile Rendering

The default map view for search results is a mosaic of all the items included in the search. This is useful for quickly getting an overview of the data available, but it can be difficult to see individual items in the mosaic. Since mosaics default to layering the most recent results on top, it may obscure older items in the mosaic. Or, varying atmospheric conditions may result in incongruent seams where the mosaic has applied pixels from different partially overlapping items.

To help with this, we've added a new "Item Preview" mode to the map view. When activated, this mode locks the current search and will render just the selected item from the search results. Since the search is locked, you can pan and zoom the map without affecting the result list. You can select a different item from the search results to preview it on the map, or use the map control to move to the next or previous item in the search results. Using the map control, you can also zoom to the current item's footprint on the map or return to the original search viewport.

To activate, click the map icon button on the thumbnail image of any search result:

```{image} images/docs-explorer-activate-item-preview_c.jpg
:height: 125
:name: Activate item preview mode
:class: no-scaled-link
```

Here's an example of using Item Preview mode to view sequential search result items showing the progression of the devastating floods in Pakistan from late 2022 using [Sentinel-1 RTC](https://planetarycomputer.microsoft.com/dataset/sentinel-1-rtc).

<video controls style="height: 400px;">
  <source src="https://ai4edatasetspublicassets.azureedge.net/assets/pc_video/docs-explorer-item-preview.mp4" type="video/mp4" />
  <p>
    Your browser doesn't support HTML video. Here is a
    <a href="https://ai4edatasetspublicassets.azureedge.net/assets/pc_video/docs-explorer-item-preview.mp4">link to the video</a> instead.
  </p>
</video>

<hr/>

(new-datasets-jan-23)=
## New datasets

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

- [NOAA MRMS QPE 1-Hour Pass 1](https://planetarycomputer.microsoft.com/dataset/noaa-mrms-qpe-1h-pass1): Integrated multi-sensor cumulative precipitation estimate for the past hour with a 1-hour latency.
- [NOAA MRMS QPE 1-Hour Pass 2](https://planetarycomputer.microsoft.com/dataset/noaa-mrms-qpe-1h-pass2): Integrated multi-sensor cumulative precipitation estimate for the past hour with a 2-hour latency.
- [NOAA MRMS QPE 24-Hour Pass 2](https://planetarycomputer.microsoft.com/dataset/noaa-mrms-qpe-24h-pass2): Integrated multi-sensor cumulative precipitation estimate for the past 24 hours with a 2-hour latency.

```{image} images/docs-data-noaa-mrms-qpe_c.jpg
:width: 558
:name: NOAA MRMS QPE
:class: no-scaled-link
```

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
## Datset Updates

### Sentinel 2 update frequency

### Terraclimate update

### GOES

- GOES-18 in the Cloud Moisture Index (CMI) product
- Entries for the GOES-R FDC, LST, RRQE, and SST datasets