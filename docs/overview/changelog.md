# Changelog

Notable changes to the Planetary Computer, October 2022 release.

## New features

This release brings a number of new features to the Explorer app, including:

- [Item preview mode](item-preview-mode)
- [Generate a timelapse GIF for a dataset mosaic](generate-a-timelapse-gif-for-a-dataset-mosaic)
- [Generate a static image of a dataset mosaic](generate-a-static-image-of-a-dataset-mosaic)
- [Advanced filter allows settings time in ranges](advanced-filter-allows-settings-time-in-ranges)
- [Ability to change sort order of search results](ability-to-change-sort-order-of-search-results)


(item-preview-mode)=
### Item preview mode

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

(generate-a-timelapse-gif-for-a-dataset-mosaic)=
### Generate a timelapse GIF for a dataset mosaic

Many of our datasets have a temporal component, and it can be interesting to see how the data changes over time. We've added a new feature to the Explorer app that allows you to generate a timelapse GIF for any dataset mosaic that has a temporal dimension. You can control the time increment, area of interest, and frame speed of the GIF. The timelapse export will use the current search parameters and render options to generate the GIF, so experiment with the settings to get a good result. To use the feature, open the overflow menu on the search results header and select "Generate timelapse animation"

```{image} images/docs-explorer-animation-screen_c.jpg
:height: 500
:name: Timelapse GIF settings
:class: no-scaled-link
```

Using a timelapse is another way to view sequential items, similar to the Item Preview feature. Using the same example for the [Sentinel-1 RTC](https://planetarycomputer.microsoft.com/dataset/sentinel-1-rtc) dataset, this GIF also shows the progression of the floods in Pakistan from late 2022.

<video controls style="height: 400px;">
  <source src="https://ai4edatasetspublicassets.azureedge.net/assets/pc_video/docs-explorer-animation.mp4" type="video/mp4" />
  <p>
    Your browser doesn't support HTML video. Here is a
    <a href="https://ai4edatasetspublicassets.azureedge.net/assets/pc_video/docs-explorer-animation.mp4">link to the video</a> instead.
  </p>
</video>

Our Landsat C2 L2 dataset goes back to 1982 in many places, and is a good example of how you can use the timelapse feature to see how the landscape has changed over time. Here's a timelapse GIF of the [Landsat C2 L2](https://planetarycomputer.microsoft.com/dataset/landsat-c2-l2) dataset for the area around the city of Las Vegas, Nevada.

<img src="https://ai4edatasetspublicassets.azureedge.net/assets/pc_video/docs-planetarycomputer-landsat-c2-l2-91b373c7ca7348.gif" alt="Timelapse of Las Vegas"/>

<hr/>

(generate-a-static-image-of-a-dataset-mosaic)=
### Generate a static image of a dataset mosaic

Similar to the timelapse export, you can also generate a static image of a dataset mosaic. This is useful for creating an image of a dataset for a report, presentation, to use as a background, or to share on social media. To use the feature, open the overflow menu on the search results header and select "Generate snapshot image".

<video loop controls style="height: 400px;">
  <source src="https://ai4edatasetspublicassets.azureedge.net/assets/pc_video/docs-explorer-image-export.mp4" type="video/mp4" />
  <p>
    Your browser doesn't support HTML video. Here is a
    <a href="https://ai4edatasetspublicassets.azureedge.net/assets/pc_video/docs-explorer-image-export.mp4">link to the video</a> instead.
  </p>
</video>

 Adjust the settings to control the area of interest and image size, then click "Generate image" to download the image.

```{image} images/docs-explorer-image-screen_c.jpg
:height: 500
:name: Static snapshot image settings
:class: no-scaled-link
```

You can also use this to create great Microsoft Teams backgrounds! Use the "Large (1920 x 1080)" image size to clip out your favorite view and set it as your background in Teams. If you want to automate the generation of Teams backgrounds - and don't mind a bit of codebase setup - check out the <https://github.com/microsoft/planetary-computer-teams-background> repository, which uses the Planetary Computer APIs to auto-rotate with the latest imagery of Sentinel 2 from the Planetary Computer.

<hr/>

(advanced-filter-allows-settings-time-in-ranges)=
### Advanced filter allows settings time in ranges

You can now specify time (in UTC) for date ranges in the Advanced date field filter. This is especially useful for frequently updating datasets like GOES-CMI, where you may want to filter for a specific time range. To use the feature, enable the Advanced filter and open the date field dropdown.

```{image} images/docs-explorer-time-filter_c.jpg
:height: 500
:name: Datetime filter
:class: no-scaled-link
```

Along with filtering on time, all search results now include the time in their display to help better identify individual items.

<hr/>

(ability-to-change-sort-order-of-search-results)=
### Ability to change sort order of search results

Last but now least, we've also added a sort direction selector for search results. You can now sort the results by date ascending or descending. This not only sorts the results list, but also the order of items applied to the mosaic on the map.

```{image} images/docs-explorer-sort-order_c.jpg
:height: 300
:name: Sort order selector
:class: no-scaled-link
```

## New datasets

This release includes several new datasets:

### GOES-R Lightning Detection

[GOES-R Lightning Detection](https://planetarycomputer.microsoft.com/dataset/goes-glm):
Continuous lightning detection over the Western Hemisphere from the Geostationary Lightning Mapper (GLM) instrument.

```{image} images/docs-data-glm_c.jpg
:width: 558
:name: GLM screenshot
:class: no-scaled-link
```

### NOAA MRMS QPE

- [NOAA MRMS QPE 1-Hour Pass 1](https://planetarycomputer.microsoft.com/dataset/noaa-mrms-qpe-1h-pass1): Integrated multi-sensor cumulative precipitation estimate for the past hour with a 1-hour latency.
- [NOAA MRMS QPE 1-Hour Pass 2](https://planetarycomputer.microsoft.com/dataset/noaa-mrms-qpe-1h-pass2): Integrated multi-sensor cumulative precipitation estimate for the past hour with a 2-hour latency.
- [NOAA MRMS QPE 24-Hour Pass 2](https://planetarycomputer.microsoft.com/dataset/noaa-mrms-qpe-24h-pass2): Integrated multi-sensor cumulative precipitation estimate for the past 24 hours with a 2-hour latency.

```{image} images/docs-data-noaa-mrms-qpe_c.jpg
:width: 558
:name: NOAA MRMS QPE
:class: no-scaled-link
```

### NOAA Monthly NClimGrid

[NOAA Monthly NClimGrid](https://planetarycomputer.microsoft.com/dataset/noaa-nclimgrid-monthly): Monthly Climate Gridded dataset with data on temperature and precipitation.

<img style="height: 300px;" src="https://ai4edatasetspublicassets.azureedge.net/assets/pc_video/docs-data-noaa-nclimgrid-monthly.gif" alt="Timelapse avg temp nclimgrid"/>

### Denver Regional Council of Governments Land Use Land Cover

[Denver Regional Council of Governments Land Use Land Cover](https://planetarycomputer.microsoft.com/dataset/drcog-lulc): 1-ft resolution land use / land cover dataset around Denver, Colorado.

```{image} images/docs-data-denver-regional_c.jpg
:width: 558
:name: Denver Regional Council of Governments Land Use Land Cover
:class: no-scaled-link
```

### Chesapeake Land Cover/Land Use

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
