# Changelog

This document highlights the new features and breaking changes between each release of the Planetary Computer.

## July 9th, 2021

### Highlights

* The [STAC API][stac-api] is now compliant with STAC 1.0. 
* Added support for earth-systems datasets in our STAC catalog. See [Datasets](docs/overview/changelog/#datasets) below for more.
* The Hub environment Dockerfiles and images are now publicly available. See [Hub environments](docs/overview/changelog/#hub-environments) below for more.

### APIs

#### New features

#### Breaking changes

### Datasets

The full list of new datasets is provided below, but we wanted to highlight that that a new *kind* of dataset are now available through our STAC API. In addition to our remote sensing datasets stored as Cloud Optimized GeoTIFFs, we're also hosting and cataloging data stored in [Zarr][zarr] format. See [this Daymet](https://planetarycomputer-staging.microsoft.com/dataset/daymet-monthly-hi) dataset for an example. This work was done with the [STAC](https://stacspec.org/) and [Pangeo](https://pangeo.io/) communities, and spurred improvements to the [datacube](https://github.com/stac-extensions/datacube) STAC extension and the creation of the [xarray-assets](https://github.com/stac-extensions/xarray-assets) STAC extension.

#### New datasets

* [Daymet Collection](https://planetarycomputer-staging.microsoft.com/dataset/group/daymet): gridded estimates of weather parameters for North America, Hawaii, and Puerto Rico at daily, monthly, and annual summaries
* [Esri 10-Meter Land Cover](https://planetarycomputer-staging.microsoft.com/dataset/io-lulc): a 10-meter resolution map of Earth’s land surface from 2020
* [High Resolution Electricity Access](https://planetarycomputer-staging.microsoft.com/dataset/hrea): Settlement-level measures of electricity access, reliability, and usage derived from VIIRS satellite imagery
* [Monitoring Trends in Burn Severity](https://planetarycomputer-staging.microsoft.com/dataset/mtbs): Annual burn severity mosaics for the continental United States and Alaska
* [Map of Biodiversity Importance](https://planetarycomputer-staging.microsoft.com/dataset/mobi): Habitat information for 2,216 imperiled species occurring in the conterminous United States
* [NASADEM HGT v001](https://planetarycomputer-staging.microsoft.com/dataset/nasadem): Global topographic data at 1 arc-second (~30m) horizontal resolution, derived primarily from data captured via the Shuttle Radar Topography Mission
* [TerraClimate](https://planetarycomputer-staging.microsoft.com/dataset/terraclimate): High-resolution global dataset of monthly climate and climatic water balance
* [USGS 3DEP Seamless DEMs](https://planetarycomputer-staging.microsoft.com/dataset/3dep-seamless): high-quality topographic data and for a wide range of other three-dimensional (3D) representations of the Nation's natural and constructed features
* [USGS Gap Analysis Project](https://planetarycomputer-staging.microsoft.com/dataset/gap): The foundation of the most detailed, consistent map of vegetation available for the United States, based on the NatureServe Ecological Systems Classification

#### Changes to existing datasets

### Hub environments

The Dockerfiles for building the environments used on the Planetary Computer Hub are now available at <https://github.com/microsoft/planetary-computer-containers>. Users can download the images from [Microsoft Container Registry](https://github.com/microsoft/ContainerRegistry):

```
$ docker pull mcr.microsoft.com/planetary-computer/python
```

The packages used in the Hub's environments have been upgraded. The following table lists some notable changes.

#### New package versions

Package            | Previous version | New version
------------------ | ---------------- | -----------
pystac             | ...              | 1.0.0rc3
pystac-client      | ...              | 0.2.0b2
dask               | ...              | 2021.6.2
planetary-computer | ...              | 0.3.0rc2

Some of these package updates include API breaking changes. We recommend reading through the relevant changelogs:

* [pystac](https://github.com/stac-utils/pystac/blob/main/CHANGELOG.md)
* [pystac-client](https://github.com/stac-utils/pystac-client/blob/main/CHANGELOG.md)
* [planetary-computer](https://github.com/microsoft/planetary-computer-sdk-for-python/blob/main/CHANGELOG.md)

[catalog]: https://planetarycomputer.microsoft.com/catalog
[stac-api]: https://planetarycomputer.microsoft.com/api/stac/v1
[zarr]: https://zarr.readthedocs.io/en/stable/