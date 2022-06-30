# Changelog

This document highlights the new features, datasets, and breaking changes between each release of the Planetary Computer.

## June 2022

This month's release includes many changes to our website tools, support for bulk STAC queries, several new datasets, and updates to our open-source dependencies and libraries.

### Highlights

- The Catalog and Explorer interfaces have been redesigned to accommodate the increased number of datasets available in the Planetary Computer.
- The entire website, including the Explorer, Catalog, and Documentation pages, have all been updated to work well on most mobile devices.
- We now provide snapshots of our STAC items for most of our collections as [GeoParquet](https://github.com/opengeospatial/geoparquet) datasets to support bulk STAC queries.

### Bulk STAC queries with GeoParquet

Many of our collections now include a `geoparquet-items` collection-level asset that links to a [GeoParquet](https://github.com/opengeospatial/geoparquet) dataset in Azure Blob Storage. Each row in these Parquet datasets is a STAC item. While most users should continue to use the normal STAC API, these Parquet datasets are a nice complement for workloads that need to return very many STAC items.

See [Bulk STAC item queries with GeoParquet](../quickstarts/stac-geoparquet) for more.

### New datasets

This release includes several new datasets in our STAC API. Each of these links to the dataset details page, which includes an example notebook.

- [Deltares Floods](https://planetarycomputer.microsoft.com/dataset/deltares-floods)
- [Deltares Water Availability](https://planetarycomputer.microsoft.com/dataset/deltares-water-availability)
- [Microsoft Buildings Footprint](https://planetarycomputer.microsoft.com/dataset/ms-buildings)
- [Kwando & Upper Zambezi Rivers HydroForecast](https://planetarycomputer.microsoft.com/dataset/kaza-hydroforecast)

## May 2022

This release includes many new datasets, API enhancements, and updates to libraries.

### Highlights

- **Improved performance and scalability of our STAC API**. Requests to our STAC API, including searches, will return faster and scale to larger concurrent loads. See the pgstac [0.5](https://github.com/stac-utils/pgstac/blob/main/CHANGELOG.md#v050) and [0.6](https://github.com/stac-utils/pgstac/releases/tag/v0.6.0) release notes for more.
- The [Explorer](https://planetarycomputer.microsoft.com/explore) now includes the ability to pin layers, allowing you to compare multiple queries. See [working with multiple layers](https://planetarycomputer.microsoft.com/docs/overview/explorer/#working-with-multiple-layers) for more.
- Many new datasets are available through our [catalog](https://planetarycomputer.microsoft.com/catalog). See the datasets section below for more.

### New datasets

This release includes many new datasets. Each of these links to the dataset details page, which includes an example notebook.

* [Sentinel-1](https://planetarycomputer.microsoft.com/dataset/group/sentinel-1): Synthetic Aperture Radar raster products, including the world's first openly licensed (_CC-BY-4.0_), globally available radiometrically terrain corrected Sentinel 1 product.
  * [Sentinel-1 RTC](https://planetarycomputer.microsoft.com/dataset/sentinel-1-rtc): Global radiometrically terrain corrected SAR imagery derived from the Sentinel 1 Level 1 GRD product.
  * [Sentinel-1 GRD](https://planetarycomputer.microsoft.com/dataset/sentinel-1-grd): Focused SAR data that has been detected, multi-looked and projected to ground range using an Earth ellipsoid model.
* [Landsat](https://planetarycomputer.microsoft.com/dataset/group/landsat): Imagery from Landsat 1-9, starting from 1972.
  * [Landsat Collection 2 Level-1](https://planetarycomputer.microsoft.com/dataset/landsat-c2-l1): Landsat Collection 2 Level-1 data from the Multispectral Scanner System (MSS) onboard Landsat 1 through Landsat 5.
  * [Landsat Collection 2 Level-2](https://planetarycomputer.microsoft.com/dataset/landsat-c2-l2): Landsat Collection 2 Level-2 data from the Thematic Mapper (TM) onboard Landsat 4 and 5, the Enhanced Thematic Mapper Plus (ETM+) onboard Landsat 7, and the Operational Land Imager (OLI) and Thermal Infrared Sensor (TIRS) onboard Landsat 8 and 9.
* [MODIS](https://planetarycomputer.microsoft.com/dataset/group/modis) imagery and derived products, starting from 2000.
  * [MODIS Burned Area Monthly](https://planetarycomputer.microsoft.com/dataset/modis-64A1-061): MODIS Burned Area Monthly
  * [MODIS Gross Primary Productivity 8-Day Gap-Filled](https://planetarycomputer.microsoft.com/dataset/modis-17A2HGF-061): MODIS Gross Primary Productivity 8-Day Gap-Filled
  * [MODIS Gross Primary Productivity 8-Day](https://planetarycomputer.microsoft.com/dataset/modis-17A2H-061): MODIS Gross Primary Productivity 8-Day
  * [MODIS Land Surface Temperature/3-Band Emissivity 8-Day](https://planetarycomputer.microsoft.com/dataset/modis-21A2-061): MODIS Land Surface Temperature/3-Band Emissivity 8-Day
  * [MODIS Land Surface Temperature/Emissivity 8-Day](https://planetarycomputer.microsoft.com/dataset/modis-11A2-061): MODIS Land Surface Temperature/Emissivity 8-Day
  * [MODIS Land Surface Temperature/Emissivity Daily](https://planetarycomputer.microsoft.com/dataset/modis-11A1-061): MODIS Land Surface Temperature/Emissivity Daily
  * [MODIS Leaf Area Index/FPAR 4-Day](https://planetarycomputer.microsoft.com/dataset/modis-15A3H-061): MODIS Leaf Area Index/FPAR 4-Day
  * [MODIS Leaf Area Index/FPAR 8-Day](https://planetarycomputer.microsoft.com/dataset/modis-15A2H-061): MODIS Leaf Area Index/FPAR 8-Day
  * [MODIS Nadir BRDF-Adjusted Reflectance (NBAR) Daily](https://planetarycomputer.microsoft.com/dataset/modis-43A4-061): MODIS Nadir BRDF-Adjusted Reflectance (NBAR) Daily
  * [MODIS Net Evapotranspiration Yearly Gap-Filled](https://planetarycomputer.microsoft.com/dataset/modis-16A3GF-061): MODIS Net Evapotranspiration Yearly Gap-Filled
  * [MODIS Net Primary Production Yearly Gap-Filled](https://planetarycomputer.microsoft.com/dataset/modis-17A3HGF-061): MODIS Net Primary Production Yearly Gap-Filled
  * [MODIS Snow Cover 8-day](https://planetarycomputer.microsoft.com/dataset/modis-10A2-061): MODIS Snow Cover 8-day
  * [MODIS Snow Cover Daily](https://planetarycomputer.microsoft.com/dataset/modis-10A1-061): MODIS Snow Cover Daily
  * [MODIS Surface Reflectance 8-Day (250m)](https://planetarycomputer.microsoft.com/dataset/modis-09Q1-061): MODIS Surface Reflectance 8-Day (250m)
  * [MODIS Surface Reflectance 8-Day (500m)](https://planetarycomputer.microsoft.com/dataset/modis-09A1-061): MODIS Surface Reflectance 8-Day (500m)
  * [MODIS Thermal Anomalies/Fire 8-Day](https://planetarycomputer.microsoft.com/dataset/modis-14A2-061): MODIS Thermal Anomalies/Fire 8-Day
  * [MODIS Thermal Anomalies/Fire Daily](https://planetarycomputer.microsoft.com/dataset/modis-14A1-061): MODIS Thermal Anomalies/Fire Daily
  * [MODIS Vegetation Indices 16-Day (250m)](https://planetarycomputer.microsoft.com/dataset/modis-13Q1-061): MODIS Vegetation Indices 16-Day (250m)
  * [MODIS Vegetation Indices 16-Day (500m)](https://planetarycomputer.microsoft.com/dataset/modis-13A1-061): MODIS Vegetation Indices 16-Day (500m)
* [USGS 3DEP](https://planetarycomputer.microsoft.com/dataset/group/3dep-lidar): Lidar elevation data as Cloud Optimized Point Cloud (COPC) and derived Cloud Optimized GeoTIFF (COG) data processed from the USGS 3D Elevation Program.
  * [USGS 3DEP Lidar Point Cloud](https://planetarycomputer.microsoft.com/dataset/3dep-lidar-copc)
  * [USGS 3DEP Lidar Height Above Ground (HAG)](https://planetarycomputer.microsoft.com/dataset/3dep-lidar-hag)
  * [USGS 3DEP Lidar Classification](https://planetarycomputer.microsoft.com/dataset/3dep-lidar-classification)
  * [USGS 3DEP Lidar Digital Surfice Model (DSM)](https://planetarycomputer.microsoft.com/dataset/3dep-lidar-dsm)
  * [USGS 3DEP Digital Terrain Model (DTM)](https://planetarycomputer.microsoft.com/dataset/3dep-lidar-dtm)
  * [USGS 3DEP Digital Terrain Model (Native)](https://planetarycomputer.microsoft.com/dataset/3dep-lidar-dtm-native)
  * [USGS 3DEP Lidar Point Source](https://planetarycomputer.microsoft.com/dataset/3dep-lidar-pointsourceid)
  * [USGS 3DEP Lidar Intensity](https://planetarycomputer.microsoft.com/dataset/3dep-lidar-intensity)
  * [USGS 3DEP Lidar Returns](https://planetarycomputer.microsoft.com/dataset/3dep-lidar-returns)
* [NAIP](https://planetarycomputer.microsoft.com/dataset/naip): National Agriculture Imagery Program (NAIP) imagery updated for 2020
* [10m Annual Land Use Land Cover](https://planetarycomputer.microsoft.com/dataset/io-lulc-9-class): Added data for 2020 and 2021 from model output generated by [Impact Observatory](http://impactobservatory.com/)
* [CIL Global Downscaled Projections for Climate Impacts Research Collection](https://planetarycomputer.microsoft.com/dataset/group/cil-gdpcir): Climate Impact Lab Global Downscaled Projections for Climate Impacts Research
* [ECMWF Open Data (real-time)](https://planetarycomputer.microsoft.com/dataset/ecmwf-forecast): ECMWF Open Data (Real Time) forecasts
* [ERA5 - PDS](https://planetarycomputer.microsoft.com/dataset/era5-pds): A comprehensive reanalysis, which assimilates as many observations as possible in the upper air and near surface.
* [ESA WorldCover 2020](https://planetarycomputer.microsoft.com/dataset/esa-worldcover): Global land cover product at 10 meter resolution for 2020 based on Sentinel-1 and Sentinel-2 data
* [ALOS Forest/Non-Forest Annual Mosaic](https://planetarycomputer.microsoft.com/dataset/alos-fnf-mosaic): Global 25-meter resolution map classifying "forest" and "non-forest" landcover.
* [ALOS PALSAR Annual Mosaic](https://planetarycomputer.microsoft.com/dataset/alos-palsar-mosaic): Global 25-meter resolution SAR image mosaic.
* [NOAA C-CAP Regional Land Cover and Change](https://planetarycomputer.microsoft.com/dataset/noaa-c-cap): Periodic coastal landcover classifications back to 1975
* [Urban Innovation Eclipse Sensor Data](https://planetarycomputer.microsoft.com/dataset/eclipse): A network of low-cost air quality sensing network for cities and led by the Urban Innovation Group at Microsoft Research
* [Planet NICFI](https://planetarycomputer.microsoft.com/dataset/group/planet-nicfi):
  * [Planet-NICFI Basemaps (Analytic)](https://planetarycomputer.microsoft.com/dataset/planet-nicfi-analytic): Planet's high-resolution, analysis-ready mosaics of the world's tropics (Microsoft - GEO RFP winners only)
  * [Planet-NICFI Basemaps (Visual)](https://planetarycomputer.microsoft.com/dataset/planet-nicfi-visual): Planet's high-resolution, analysis-ready mosaics of the world's tropics (Microsoft - GEO RFP winners only)

### API updates

#### STAC API

- Updated the STAC API to [v1.0.0-rc.1](https://github.com/radiantearth/stac-api-spec/releases/tag/v1.0.0-rc.1)
- Initial support for [queryables](https://github.com/radiantearth/stac-api-spec/tree/master/fragments/filter#queryables) in the STAC API. See [Sentinel-2-l2a](https://planetarycomputer.microsoft.com/api/stac/v1/collections/sentinel-2-l2a/queryables) for an example. Additional queryables and more metadata description in coming releases.
- Scalability and performance improvements.

#### Data API

- Upgrades to pgstac-titiler [0.1.0a7](https://github.com/stac-utils/titiler-pgstac/blob/master/CHANGES.md#010a7-2022-04-05-pre-release)
- Scalability and performance improvements.

### Documentation and Tutorials

In addition to the dataset examples, we have several new tutorials going in-depth on a specific topic.

* [Customizable radiometric terrain correction of Sentinel-1 products](https://planetarycomputer.microsoft.com/docs/tutorials/customizable-rtc-sentinel1/) using the open-source [sarsen](https://github.com/bopen/sarsen) package.
* [Computing climate indicators with xclim](https://planetarycomputer.microsoft.com/dataset/cil-gdpcir-cc0#Climate-indicators)

### Hub environments

- Updated to [planetary-computer-containers 2022.05.11.0](https://github.com/microsoft/planetary-computer-containers/releases/tag/2022.05.11.0)

### Changes
Changes in behavior that existing users may need to account for:

- The `landsat-8-c2-l2` collection is deprecated. This collection only contained Landsat 8 images from Collection 2. Please use the `landsat-c2-l2` collection, which now has data from Landsat 4 - 9 spanning all the way back to 1982. Existing workflows using landsat-8-c2-l2 items should be able to switch to `landsat-c2-l2` without disruption. `landsat-8-c2-l2` is removed from the website but remains in the STAC API; however it will no longer be updated with new items.
- Some queries on date ranges may return different results with this new release. This is due to corrections in the date range logic in our underlying metadata store, PgSTAC. For Items with all of a `start_datetime`, `end_datetime`, and `datetime` property, only the `start_datetime` and `end_datetime` will be considered, whereas previously `datetime` was the target of the search.


## January 2022

This release includes several new datasets, features, and updates to libraries.

### Highlights

- The [Explorer](https://planetarycomputer.microsoft.com/explore) tool now has an advanced mode which allows creating custom queries against our datasets.
- Six new datasets have been added to our [catalog](https://planetarycomputer.microsoft.com/catalog).
- We've open-sourced our STAC API, Tiler API, and our frontend tools — in addition to the Hub. See more details at our main [repository](https://github.com/microsoft/planetarycomputer).

### APIs

#### STAC API

##### New features

- Our STAC API is now open-source! [Check out the code on GitHub](https://github.com/microsoft/planetary-computer-apis)
- The API supports the latest version of the [OGC API - Features - Part 3: Filtering and the Common Query Language](https://docs.ogc.org/DRAFTS/21-065.html) language syntax, known as CQL2. The API supports CQL JSON currently, with CQL TEXT support planned for a future release.
- Implements STAC API [v1.0.0-beta.4](https://github.com/radiantearth/stac-api-spec/releases/tag/v1.0.0-beta.4)
- Upgraded to PgSTAC [v0.4.3](https://github.com/stac-utils/pgstac/releases/tag/v0.4.3) and stac-fastpi [v2.3.0](https://github.com/stac-utils/stac-fastapi/releases/tag/2.3.0)

#### Data API

##### New features

- Our tiling endpoints were upgraded to the latest version of [TiTiler](https://developmentseed.org/titiler/). This has some breaking changes to the query string parameters, [see GitHub](https://github.com/developmentseed/titiler/discussions/396) for more details.
- Added endpoints to generate map legend configuration from a set of TiTiler render parameters.

#### New API datasets

- [GPM IMERG](https://planetarycomputer.microsoft.com/dataset/gpm-imerg-hhr): A time series of precipitation over the majority of the earth.
- [10m Annual Land Use Land Cover (9-class)](https://planetarycomputer.microsoft.com/dataset/io-lulc-9-class): A time series of annual global maps of land use and land cover.
- [Earth Exchange Global Daily Downscaled Projections](https://planetarycomputer.microsoft.com/dataset/nasa-nex-gddp-cmip6): Global downscaled climate scenarios derived from the General Circulation Model runs conducted under the Coupled Model Intercomparison Project Phase 6.
- [Land Cover of Canada](https://planetarycomputer.microsoft.com/dataset/nrcan-landcover): Collection of Land Cover products for Canada as produced by Natural Resources Canada using Landsat satellite imagery.
- [Chloris Biomass](https://planetarycomputer.microsoft.com/dataset/chloris-biomass): Estimates of stock and change in aboveground biomass for Earth's terrestrial woody vegetation ecosystems.
- [gNATSGO Soil Database](https://planetarycomputer.microsoft.com/dataset/group/gnatsgo): A composite database that provides complete coverage of the best available soils information for all areas of the United States and Island Territories.

#### New Blob Storage datasets

- We've added Deltares [Global Flood Maps](https://microsoft.github.io/AIforEarthDataSets/data/deltares-floods.html) and [Global Water Supply](https://microsoft.github.io/AIforEarthDataSets/data/deltares-water-availability.html) datasets to our blob storage catalog.

### Hub environments

#### Support for batch workflows

The Planetary Computer Hub is now integrated with [kbatch](https://kbatch.readthedocs.io/en/latest/) to run asynchronous / batch workflow jobs, complementing JupyterHub's support
for interactive computing. See the [kbatch overview](../overview/batch) and the [kbatch documentation](https://kbatch.readthedocs.io/en/latest/) for more.

#### New package versions

The Planetary Computer Hub has been upgraded to use container images from the [planetary-computer-containers 2022.01.17.0 release](https://github.com/microsoft/planetary-computer-containers/releases/tag/2022.01.17.0). In particular, this release includes

- pystac-client 0.3.2, with support for cql2-json queries
- leafmap 0.7.2, with support for adding STAC items from the Planetary Computer's STAC catalog and tiling with the Planetary Computer's data API

See the release notes for the changes in the various packages provided in the Planetary Computer's environment.

### Website

- Explorer advanced mode offers a custom query builder interface, and searches use the new CQL2 syntax
- Explorer now generates dynamic legends for continuous and categorical datasets
- Updated styling and layout of the Planetary Computer Data Catalog and Explorer
- The Data Catalog and Explorer tools are [open-sourced](https://github.com/microsoft/PlanetaryComputerDataCatalog)

## September 2021

This release includes several new datasets, features, and updates to libraries.

### Highlights

- Launched the [Planetary Computer Explorer](https://planetarycomputer.microsoft.com/explore) (see [documentation](https://planetarycomputer.microsoft.com/docs/overview/explorer/))
- Added [GOES-R Cloud and Moisture Imagery](https://planetarycomputer.microsoft.com/dataset/goes-cmi) along with other datasets
- Added support for tabular datasets to the STAC API
- Added support for CQL to the STAC API
- Added support for dynamic mosaics of STAC query results to the Data API
- The Planetary Computer Hub configuration is now open-source. See <https://github.com/microsoft/planetary-computer-hub>.

### APIs

#### STAC API

##### New features

- Implementation of the [filter]() extension: The API now supports the STAC API [filter extension](https://github.com/radiantearth/stac-api-spec/tree/master/fragments/filter), which brings support for the [OGC API - Features - Part 3: Filtering and the Common Query Language (CQL)](https://portal.ogc.org/files/96288) to STAC. The API supports CQL JSON currently, with CQL TEXT support planned for a future release.
- Implements STAC API [v1.0.0-beta.3](https://github.com/radiantearth/stac-api-spec/releases/tag/v1.0.0-beta.3), the latest STAC API version at the time of release.

#### Data API

##### New features

- Implemented STAC query mosaics through the [titiler-pgstac](https://github.com/stac-utils/titiler-pgstac) project. This API allows mosaics of the results of STAC queries, and powers the map tiles for the new Explorer front-end.

#### New datasets

* [GOES-R ABI L2 Cloud & Moisture Imagery](https://planetarycomputer.microsoft.com/dataset/group/goes): This dataset provides 16 bands from the ABI instrument aboard the GOES-16 and GOES-17 satellites. We provide both NetCDF and COG data assets. More GOES-R products are coming soon!
* [ALOS DEM](https://planetarycomputer.microsoft.com/dataset/alos-dem): a 30-meter resoluation global digital surface model.
* [Copernicus DEM](https://planetarycomputer.microsoft.com/dataset/cop-dem-glo-30): a global digital surface model available at both 30- and 90-meter resolution.
* [Global Biodiversity Information Facility (GBIF)](https://planetarycomputer.microsoft.com/dataset/gbif): records of species occurrences from a wide array of sources including specimen-related data from natural history museums, observations from citizen science networks, and automated biodiversity surveys.
* [US Census 2020](https://planetarycomputer.microsoft.com/dataset/us-census): information on population and geographic boundaries at various levels of cartographic aggregation.
* [gridMET](https://planetarycomputer.microsoft.com/dataset/gridmet): a dataset of daily surface meteorological data covering the contiguous United States at ~4km resolution.
* [USFS Forest Inventory and Analysis (FIA)](https://planetarycomputer.microsoft.com/dataset/fia): Status and trends on U.S. forest location, health, growth, mortality, and production.

### Hub environments

#### New package versions

The Planetary Computer Hub has been upgraded to use container images from the [planetary-computer-containers 2021.09.27.0 release](https://github.com/microsoft/planetary-computer-containers/releases/tag/2021.09.27.0).
Among other changes, these container images include

* pystac-client 0.3.0b1
* dask-geopandas 0.1.0a4
* planetary-computer 0.4.2

See the release notes for the changes in the various packages provided in the Planetary Computer's environment.

```{note}
pystac-client 0.2.0 doesn't recognize the new conformance classes provided by the Planetary Computer's STAC API. Either set "ignore_conformance=True" when creating your pystac Client, or upgrade to pystac-client>=0.3.0b1.
```

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
