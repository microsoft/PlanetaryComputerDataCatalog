# Changelog

This document highlights the new features and breaking changes between each release of the Planetary Computer.

## July 9th, 2021

### Highlights

* The [STAC API][stac-api] is now compliant with STAC 1.0. 
* Added support for earth-systems datasets in our STAC catalog. See [Datasets](#datasets) below for more.
* The Hub environment Dockerfiles and images are now publicly available. See [Hub environments](#hub-environments) below for more.

### APIs

#### New features

#### Breaking changes

### Datasets

The full list of new datasets is provided below, but we wanted to highlight that that a new *kind* of dataset are now available through our STAC API. In addition to our remote sensing datasets stored as Cloud Optimized GeoTIFFs, we're also hosting and cataloging data stored in [Zarr][zarr] format. See [this Daymet](https://planetarycomputer-staging.microsoft.com/dataset/daymet-monthly-hi) dataset for an example. This work was done with the [STAC](https://stacspec.org/) and [Pangeo](https://pangeo.io/) communities, and spurred improvements to the [datacube](https://github.com/stac-extensions/datacube) STAC extension and the creation of the [xarray-assets](https://github.com/stac-extensions/xarray-assets) STAC extension.

#### New datasets

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