# Changelog

This document highlights the new features, datasets, and breaking changes between each release of the Planetary Computer.

## September 2021

This release includes several new datasets and updates to libraries.

### Highlights

- Launched the [Explorer](https://planetarycomputer.microsoft.com/explore)
- Added GOES-R Cloud and Moisture Imagery along with other datasets.
- Added support for tabular datasets to the STAC API
- Added support for CQL to the STAC API
- Added support for dynamic mosaicing of STAC query results to the Data API

### APIs

#### STAC API

##### New features

- Implementation of the [filter]() extension: The API now supports the STAC API [filter extension](https://github.com/radiantearth/stac-api-spec/tree/master/fragments/filter), which brings support for the [OGC API - Features - Part 3: Filtering and the Common Query Language (CQL)](https://portal.ogc.org/files/96288) to STAC. The API supports CQL JSON currently, with CQL TEXT support planned for a future release.
- Implements STAC API [v1.0.0-beta.3](https://github.com/radiantearth/stac-api-spec/releases/tag/v1.0.0-beta.3), the latest STAC API version at the time of release.

##### Breaking changes

#### Data API

- Implemented STAC query mosaicing through the [titiler-pgstac](https://github.com/stac-utils/titiler-pgstac) project. This API allows mosaicing of the results of STAC queries, and powers the map tiles for the new Explorer front-end.

### Datasets

#### New datasets

* [GOES-R ABI L2+ Cloud & Moisture Imagery](https://planetarycomputer-staging.microsoft.com/dataset/group/goes): This dataset provides 16 bands from the ABI instrument aboard the GOES-16 and GOES017 satellites. We provide both NetCDF and COG data assets. More derived products coming soon!
* [ALOS DEM](https://planetarycomputer-staging.microsoft.com/dataset/alos-dem): a 30-meter resoluation global Digital Surface Model.
* [Copernicus DEM](https://planetarycomputer-staging.microsoft.com/dataset/cop-dem-glo-90): A Digital Surface Model (DSM) which represents the surface of the Earth including buildings, infrastructure and vegetation.
* [Global Biodiversity Information Facility (GBIF)](https://planetarycomputer-staging.microsoft.com/dataset/gbif): records of species occurrences from a wide array of sources including specimen-related data from natural history museums, observations from citizen science networks and environment recording schemes.
* [US Census 2020](https://planetarycomputer-staging.microsoft.com/dataset/us-census): information on population and geographic boundaries at various levels of cartographic aggregation.
* [gridMET](https://planetarycomputer-staging.microsoft.com/dataset/gridmet): a dataset of daily high-spatial resolution surface meteorological data covering the contiguous US.
* [USFS Forest Inventory and Analysis (FIA)](https://planetarycomputer-staging.microsoft.com/dataset/fia): Status and trends on U.S. forest location, health, growth, mortality, and production.

#### Changes to existing datasets

### Hub environments

#### New package versions

### Website

* New guide for deploying your own Hub: <https://planetarycomputer.microsoft.com/docs/concepts/hub-deployment/>
* New guide for accessing Planetary Computer datasets from [GitHub Codespaces](https://github.com/features/codespaces): <https://planetarycomputer.microsoft.com/docs/overview/ui-codespaces/>

## August 2021

This minor release has the following __breaking__ changes:

- The `sentinel-2-l2a` Item IDs have been updated to include the Product Discriminator number. See [this stactools issue](https://github.com/stactools-packages/sentinel2/issues/5) for more information.
- The `sentinel-2-l2a` Items have removed the downsampled version of assets. This includes renaming asset keys to no longer have the resolution; for example, `visual-10m` has been renamed to `visual` and `visual-20m` has been removed.

#### New datasets

- [JRC Global Surface Water](https://planetarycomputer.microsoft.com/dataset/jrc-gsw): surface water distribution from 1984 to 2020, based on data from the Landsat 5, 7, and 8 sensors.

## July 2021

### Highlights

* The [STAC API][stac-api] is now compliant with [STAC 1.0](https://medium.com/radiant-earth-insights/stac-specification-1-0-0-released-c59e8c848077).
* Added a new Data API with several features, including the ability to preview datasets and items. See [Data API](docs/overview/changelog/#data-api) below for more.
* Added support for Earth-systems datasets in our STAC catalog. See [Datasets](./docs/overview/changelog/#datasets) below for more.
* The Hub environment Dockerfiles and images are now publicly available. See [Hub environments](docs/overview/changelog/#hub-environments) below for more.

### APIs

#### STAC API

##### New features

- Supports STAC 1.0
- Supports the [Query extension](https://github.com/radiantearth/stac-api-spec/tree/master/fragments/query)
- Utilizes the latest [stac-fastapi](https://github.com/stac-utils/stac-fastapi) backed by [pgstac](https://github.com/stac-utils/pgstac)

##### Breaking changes

- Users will need to use tools that work with STAC 1.0 with the STAC API. As STAC 1.0 was recently released, the state of the tools ecosystem is still catching up. See [the new Hub package versions](docs/overview/changelog/#new-package-versions) below for packages that will work with the STAC API.

#### Data API

This is a new API that provides [titiler](https://developmentseed.org/titiler/) endpoints for our
STAC Items. There are also collection tile endpoints for
some datasets. See the [Data API docs](../reference/data.md) for a list of endpoints available. These endpoints are not available for all Collections and Items. For Collections and Items that have visualization endpoints, assets are added for [TileJSON](https://github.com/mapbox/tilejson-spec) and links for simple Leaflet map previews are added by the STAC API. For example, <https://planetarycomputer.microsoft.com/api/data/v1/collection/map?collection=io-lulc> is the preview link for the new [Esri 10-Meter Land Cover](https://planetarycomputer.microsoft.com/api/data/v1/collection/map?collection=io-lulc) dataset.

The Data API should be considered in an alpha state - expect updates and breaking changes in the future.

### Datasets

The full list of new datasets is provided below, but we wanted to highlight that that a new *kind* of dataset is now available through our STAC API. In addition to our remote sensing datasets stored as Cloud Optimized GeoTIFFs, we're also hosting and cataloging data stored in [Zarr][zarr] format. See [this Daymet dataset](https://planetarycomputer.microsoft.com/dataset/daymet-monthly-hi) for an example. This work was done with the [STAC](https://stacspec.org/) and [Pangeo](https://pangeo.io/) communities, and spurred improvements to the [datacube](https://github.com/stac-extensions/datacube) STAC extension and the creation of the [xarray-assets](https://github.com/stac-extensions/xarray-assets) STAC extension.

#### New datasets

The following datasets are now available in our [data catalog][catalog] and [STAC API][stac-api]:

* [Daymet Collection](https://planetarycomputer.microsoft.com/dataset/group/daymet): gridded estimates of weather parameters for North America, Hawaii, and Puerto Rico at daily, monthly, and annual temporal resolutions
* [Esri 10-Meter Land Cover](https://planetarycomputer.microsoft.com/dataset/io-lulc): a 10-meter resolution map of Earth’s land surface from 2020
* [HREA: High Resolution Electricity Access](https://planetarycomputer.microsoft.com/dataset/hrea): settlement-level measures of electricity access, reliability, and usage derived from VIIRS satellite imagery
* [MTBS: Monitoring Trends in Burn Severity](https://planetarycomputer.microsoft.com/dataset/mtbs): annual burn severity mosaics for the continental United States and Alaska
* [MoBI: Map of Biodiversity Importance](https://planetarycomputer.microsoft.com/dataset/mobi): habitat information for 2,216 imperiled species occurring in the conterminous United States
* [NASADEM HGT v001](https://planetarycomputer.microsoft.com/dataset/nasadem): global topographic data at 1 arc-second (~30m) horizontal resolution, derived primarily from data captured via the Shuttle Radar Topography Mission
* [TerraClimate](https://planetarycomputer.microsoft.com/dataset/terraclimate): global monthly climate and climatic water balance
* [USGS 3DEP Seamless DEMs](https://planetarycomputer.microsoft.com/dataset/3dep-seamless): high-quality topographic data and for a wide range of other three-dimensional (3D) representations of natural and constructed features in the United States
* [USGS Gap Land Cover](https://planetarycomputer.microsoft.com/dataset/gap): US-wide land cover information for 2011

#### Changes to existing datasets

* New items from Sentinel-2 and Landsat 8 are now continuously available through the STAC API
* Changed the item IDs for [Sentinel-2 Level-2A](https://planetarycomputer.microsoft.com/dataset/sentinel-2-l2a) and [Landsat 8 Collection 2 Level-2](https://planetarycomputer.microsoft.com/dataset/landsat-8-c2-l2) to not include the processing date
* Fixed issues with missing Sentinel-2 scenes
* Fixed various quality issues with some Landsat 8 scenes by updating to the most recently processed version available from USGS
* Fixed Landsat 8 STAC item footprints being off by half a pixel

### Hub environments

The Dockerfiles for building the environments used on the Planetary Computer Hub are now available at <https://github.com/microsoft/planetary-computer-containers>. Users can download the images from [Microsoft Container Registry](https://github.com/microsoft/ContainerRegistry):

```
$ docker pull mcr.microsoft.com/planetary-computer/python
```

The packages used in the Hub's environments have been upgraded. The following table lists some notable changes.

#### New package versions

Package            | Previous version | New version
-------------------|------------------|------------
pystac             | 0.5.6            | 1.0.0rc3
pystac-client      | 0.1.1            | 0.2.0b2
dask               | 2021.5.0         | 2021.6.2
planetary-computer | 0.2.2            | 0.3.0rc2

Some of these package updates include API breaking changes. We recommend reading through the relevant changelogs:

* [pystac](https://github.com/stac-utils/pystac/blob/main/CHANGELOG.md)
* [pystac-client](https://github.com/stac-utils/pystac-client/blob/main/CHANGELOG.md)
* [planetary-computer](https://github.com/microsoft/planetary-computer-sdk-for-python/blob/main/CHANGELOG.md)

[catalog]: https://planetarycomputer.microsoft.com/catalog
[stac-api]: https://planetarycomputer.microsoft.com/api/stac/v1
[zarr]: https://zarr.readthedocs.io/en/stable/

### Website

Some datasets now have a built-in map viewer. Check it out on [Esri 10m Land Cover](/dataset/io-lulc#viewer).
