# Changelog

This document highlights the new features and breaking changes for each release of the Planetary Computer.

## July 9th, 2021

### Highlights

* The [STAC API][stac-api] is now compliant with STAC 1.0. 
* The Hub environment Dockerfiles and images are now publicly available. See [#hub-environments] below for more.

### APIs

#### New features

#### Breaking changes

### Datasets

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

[catalog](https://planetarycomputer.microsoft.com/catalog)
[stac-api](https://planetarycomputer.microsoft.com/api/stac/v1)