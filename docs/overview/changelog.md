# Changelog

This is the changelog for the Planetary Computer January 2023 release. See <a href="docs/changelogs/history">previous changelogs</a> for notes about previous releases.

This release brings a new datasets and features, including:

- [Vector rendering](vector-tile-rendering)
- [New datasets](new-datasets-jan-23)
- [Dataset updates](dataset-updates-jan-23)
- [Updates to our Terms of Use](terms-of-use-update-jan-23)
- [Notices for upcoming release](future-release-notice-jan-23)

(vector-tile-rendering)=
## Vector Rendering

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
  <source src="https://ai4edatasetspublicassets.azureedge.net/assets/pc_video/vector-tile-ms-buildings-feature.mp4" type="video/mp4" />
  <p>
    Your browser doesn't support HTML video. Here is a
    <a href="https://ai4edatasetspublicassets.azureedge.net/assets/pc_video/vector-tile-ms-buildings-feature.mp4">link to the video</a> instead.
  </p>
</video>

<hr/>

(new-datasets-jan-23)=
## New datasets

This release includes several new datasets:

### ESA Climate Change Initiative Land Cover

The <a href="dataset/group/esa-cci-lc">ESA Climate Change Initiative Land Cover</a> datasets consistent global annual land cover maps at 300m spatial resolution from 1992 to 2020. There are collections containing <a href="dataset/esa-cci-lc">Cloud Optimized GeoTIFFs</a> and <a href="dataset/esa-cci-lc-netcdf">NetCDF</a> files.

This is a timelapse from 1992-2020 over <a href="/explore?c=-55.0498%2C-12.5996&z=5.29&v=2&d=esa-cci-lc&s=true%3A%3A100%3A%3Atrue&sr=desc&m=Most+recent+%282020%29&r=Classification&ae=0">the Amazon Rainforest in Brazil and Bolivia</a>:

<img style="width: 600px;" src="https://ai4edatasetspublicassets.azureedge.net/assets/pc_video/docs-esa-cci-lc-1992-2020-brazil.gif" alt="Timelapse ESA CCI LC 1992-2020 over Brazil"/>

### NOAA Climate Normals

The <a href="dataset/group/noaa-climate-normals">NOAA US Climate Normals</a> datasets provide information about typical climate conditions for thousands of weather station locations across the United States.

The individual weather station data is contained in the <a href="dataset/noaa-climate-normals-tabular">noaa-climate-normals-tabular</a> colleciton, which contains tabular data in GeoParquet format.

Additionally, there is gridded data provided in the collections <a href="dataset/noaa-climate-normals-gridded">noaa-climate-normals-gridded</a>, which contains Cloud Optimized GeoTIFFs, and <a href="dataset/noaa-climate-normals-netcdf">noaa-climate-normals-netcdf</a> which contains NetCDF files.

Note that this dataset resides in the East US Azure region.

```{image} https://ai4edatasetspublicassets.azureedge.net/assets/pc_thumbnails/noaa-climate-normals-gridded-thumb.png
:width: 700
:name: NOAA Climate Normals
:class: no-scaled-link
```

### Cropland Data Layer

The [USDA Cropland Data Layer](https://planetarycomputer.microsoft.com/dataset/usda-cdl) is a crop-specific land cover classification product of more than 100 crop categories grown in the United States.

```{image} images/changelog-usda-cdl.png
:width: 558
:name: Compland Data Layer
:class: no-scaled-link
```

### USGS Land Change Monitoring, Assessment, and Projection

The <a href="dataset/group/usgs-lcmap">USGS Land Change Monitoring, Assessment, and Projection (LCMAP)</a> datasets provide land cover mapping and change monitoring from the U.S.

There are two datasets; one containing "Collection 1.3" data for the Conterminous United States (<a href="dataset/usgs-lcmap-conus-v13">usgs-lcmap-conus-v13</a>) and another containing "Collection 1.0" data for Hawaii (<a href="dataset/usgs-lcmap-hawaii-v10">usgs-lcmap-hawaii-v10</a>)



This is a timelapse from 1985-2021 over <a href="/explore?c=-121.2561%2C39.7589&z=8.36&v=2&d=usgs-lcmap-conus-v13%7C%7Cusgs-lcmap-conus-v13&s=false%3A%3A100%3A%3Atrue%7C%7Ctrue%3A%3A100%3A%3Atrue&sr=desc%7C%7Cdesc&m=1985%7C%7CMost+recent+%282021%29&r=Land+Cover%7C%7CLand+Cover&ae=0">California's Plumas National Forest</a>:

<img style="width: 600px;" src="https://ai4edatasetspublicassets.blob.core.windows.net/assets/pc_video/docs-usgs-lcmap-cali-1985-2021.gif" alt="Timelapse ESA CCI LC 1992-2020 over Brazil"/>

### National Wetlands Inventory

The  <a href="dataset/fws-nwi">FWS National Wetlands Inventory</a> collection contains more than 35 million wetland and deepwater features. This dataset covers the conterminous United States, Hawaii, Puerto Rico, the Virgin Islands, Guam, the major Northern Mariana Islands and Alaska.

```{image} images/changelog-fws-nwi.png
:height: 400
:name: FWS National Wetlands Inventory
:class: no-scaled-link
```
(dataset-updates-jan-23)=
## Dataset updates

### NOAA GOES updates
- GOES-18 data is now available in the <a href="dataset/goes-cmi">Cloud Moisture Index (goes-cmi)</a> collection.
- Additional data products for GOES that are not yet in the API are documented in the catalog: <a href="dataset/storage/goes-fdc">Fire Detection and Characterization (FDC)</a>, <a href="dataset/storage/goes-lst">Land Surface Temperature (LST)</a>, <a href="dataset/storage/goes-rrqpe">Rainfall Rate and Quantitative Precipitation Estimation (RRQPE)</a>, and <a href="dataset/storage/goes-sst">Sea Surface Temperature (SST)</a>
- The goes-cmi collection now has a render configuration that utilizes infrared data to better visualize night-time scenes. See <a href="/explore?c=-92.2446%2C37.2474&z=3.64&v=2&d=goes-cmi&s=false%3A%3A100%3A%3Atrue&ae=0&sr=desc&m=cql%3A6ded4476e6da6a428e449b19bd25ab17&r=Infrared">this example</a> in the Explorer.

### Other dataset updates

- [TerraClimate](https://planetarycomputer.microsoft.com/dataset/terraclimate) was updated to include the latest data from the producer, the [Climatology Lab](https://www.climatologylab.org/terraclimate.html). The dataset now covers 1958 - 2021. Note that some variables, such as the station influence variables, are no longer provided. The Zarr store linked from the STAC collection is at a new URL. The data at the old URL will be deleted sometime in the future. In addition, the STAC metadata now includes the latest updates from the [`xarray-assets`](https://github.com/stac-extensions/xarray-assets) STAC extension.
- The <a href="dataset/storage/noaa-nws">NOAA National Water Model</a> data products, which are hosted but not yet fully integrated into the API, are now documented in the data catalog.
- Using [new functionality in stactools](https://github.com/stac-utils/stactools/pull/307), the footprints in the <a href="dataset/aster">ASTER collection</a> have been update to better match the actual image data, rather than the full raster extent.
- Collections now have an `msft:region` property, which indicates the Azure Region in which the data is hosted.
- The <a href="dataset/ms-buildings">Microsoft Building Footprints</a> dataset can now be visualized in the Explorer, using the vector rendering feature described above.

(future-release-notice-jan-23)=

## Documentation Improvements

- Added a new [Sentinel-2 notebook](https://planetarycomputer.microsoft.com/dataset/sentinel-2-l2a#Baseline-Change) demonstrating the Sentinel-2 L2A Baseline Change, and how to harmonize data across it.
- Expanded the Data Catalog documentation to include a <a href="docs/concepts/data-catalog/#data-providers">new section</a> on how the Planetary Computer relates to data providers like the [NOAA Open Data Dissemination](https://www.noaa.gov/information-technology/open-data-dissemination) program.

(terms-of-use-update-jan-23)=
## Updates to our Terms of Use

Our <a href="/terms">Terms of Use</a> has been updated to clarify terms about the data access tokens issued by the Planetary Computer for data access. No change in behavior or permissions has occurred. Please read the Terms of Use to get more information about the permitted utilization of data tokens for the Planetary Computer.

## Notices for upcoming release


Please be advised that in the next release, approximately in the April/May 2023 time frame, we will be upgrading the version of our raster tiling engine, TiTiler. This will result in some changes to the way rendering parameters are specified when generating image tiles. These changes will affect both the [Item Tile endpoints](https://planetarycomputer.microsoft.com/api/data/v1/docs#/Item%20tile%20endpoints) and the [Mosaic Tile endpoints](https://planetarycomputer.microsoft.com/api/data/v1/docs#/PgSTAC%20Mosaic%20endpoints).

These changes will **not** affect how you use the Explorer or any links you've saved or shared via the Explorer. It will only affect certain query string parameters you may have generated that hit `/api/data/` endpoints directly.

Please see the upstream changes for more information:

- [pgstac-titiler changelog](https://github.com/stac-utils/titiler-pgstac/blob/master/CHANGES.md?plain=1#L55-L63)
- [rio-tiler changelog](https://github.com/cogeotiff/rio-tiler/blob/main/docs/src/v4_migration.md#band-names)

If you have any questions, please reach out to us on our [GitHub Discussions page](https://github.com/microsoft/planetarycomputer/discussions).
