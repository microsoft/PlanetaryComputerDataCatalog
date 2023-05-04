# Changelog

This is the changelog for the Planetary Computer May 2023 release. See <a href="docs/changelogs/history">previous changelogs</a> for notes about previous releases.

This release brings new datasets, updates to existing datasets, and new features, including:

- [New datasets](new-datasets-may-23)
- [Dataset updates](dataset-updates-may-23)
- [New features](new-features-may-23)

(new-datasets-may-23)=
## New datasets

This release includes several new datasets:

### NOAA Climate Data Records


The <a href="dataset/group/noaa-cdr">NOAA Climate Data Records</a> (CDRs) datasets  offer reliable, comprehensive datasets that deliver insights into land, ocean, atmospheric, and ice sheet changes over time. The CDRs are generated using modern data analysis methods applied to historical and ongoing satellite data, allowing for the identification of climate trends and supporting various applications, such as natural resource management and policy development. The datasets include Sea Surface Temperature (WHOI CDR), Global Ocean Heat Content CDR, and Sea Surface Temperature - Optimum Interpolation CDR, among others.

```{image} images/changelog-dataset-noaa-cdr.png
:height: 500
:name: Sea Surface Temperature - WHOI CDR with GOES imagery
:class: no-scaled-link
```

### Sentinel 3

(TODO: Create dataset group and link here)

```{image} images/changelog-dataset-sentinel-3.png
:height: 500
:name: TODO
:class: no-scaled-link
```

### Sentinel 5P

The Copernicus Sentinel-5 Precursor mission offers high-resolution measurements of Earth's atmosphere using the TROPOspheric Monitoring Instrument (TROPOMI) aboard a single satellite. This mission bridges the data gap between retired ENVISAT and AURA missions and the upcoming Sentinel-5 mission. The Level 2 data provided includes total columns of ozone, sulfur dioxide, nitrogen dioxide, carbon monoxide, and formaldehyde, along with tropospheric columns of ozone, vertical profiles of ozone, and cloud & aerosol information. These measurements are crucial for enhancing air quality forecasts and monitoring atmospheric constituents. The STAC Collection offers Sentinel-5 Precursor Level 2 data in NetCDF format, covering various products such as aerosol indices, methane total columns, cloud information, and more since April 2018.

```{image} images/changelog-dataset-sentinel-5p.png
:height: 500
:name: TODO
:class: no-scaled-link
```

### Biodiversity Intactness

The <a href="dataset/io-biodiversity">Biodiversity Intactness</a> dataset provides 100-meter gridded maps estimating terrestrial biodiversity intactness for 2017-2020. These maps are essential tools for spatial planning, management, and monitoring global biodiversity, as well as identifying remaining intact habitats. This dataset is based on the PREDICTS database and employs contemporary global geospatial layers of human pressures to provide high-resolution monitoring. Biodiversity intactness is measured using two metrics: Abundance and Compositional Similarity.

```{image} images/changelog-dataset-io-biodiversity.png
:height: 500
:name: TODO
:class: no-scaled-link
```

(dataset-updates-may-23)=
## Updates to existing datasets

### ESA World Cover

- Added 2021 data

### Impact Observatory Land Cover

- Added 2022 data

### NAIP

- Added 2021 and 2022 data

### MS Buildings

- Added data from the 2023-04-25 processing batch.
- Geoparquet files are available in Delta Table format.

The [Delta](https://delta.io/) Table format provides scalable metadata handling, which will greatly speed up data access when you're loading a subset of the data. Filtering the global dataset by region name or quadkey is now extremely fast.
The newly updated [example notebook](https://planetarycomputer.microsoft.com/dataset/ms-buildings/#Example-Notebook) goes into more detail.

(new-features-may-23)=
## New features

### Hillshade and contour lines

We're making use of new advanced [features in
TiTiler](https://developmentseed.org/titiler/examples/notebooks/Working_with_Algorithm/),
the open source project powering our raster visualizations in the Explorer. For
any [DEM dataset](), we can now compute hillshades or contour lines on the fly. The
default rendering for these datasets has been updated. In the future, we plan on
using this new feature to allow users to apply other operations to a variety of dataset types.

By pinning an layer over a DEM hillshade layer, and adjusting the opacity, you
can create a 3D effect providing more visual context to the terrain. See [this
example](https://planetarycomputer.microsoft.com/explore?c=33.2568%2C-6.1073&z=7.79&v=2&d=io-lulc-9-class%7C%7Ccop-dem-glo-30&s=false%3A%3A62%3A%3Atrue%7C%7Ctrue%3A%3A100%3A%3Atrue&sr=desc%7C%7Cdesc&m=2021%7C%7CMost+recent&r=Default%7C%7CHillshade&ae=0)
using our COP 30 DEM and IO LULC 9 Class datasets:

```{image} images/docs-explorer-terrain-lulc.png
:height: 500
:name: COP 30 DEM hillshade with LULC
:class: no-scaled-link
```

### Improved support for STAC API specification

Improved our support for STAC API specification through better support of [queryables](https://github.com/stac-api-extensions/filter#queryables). Queryables let STAC clients know what properties can be searched over through our STAC API, and are based on the OGC API: Features specification. Our API has been updated to better support this part of the specification.

```{image} images/docs-explorer-vector-buildings-at-light.png
:height: 500
:name: MS Buildings dataset nighttime lights in Nigeria
:class: no-scaled-link
```

### Python environment update in the Planetary Computer Hub

This release updates the Python environment to the 2023.5.3.0 release from [Planetary Computer Containers](https://github.com/microsoft/planetary-computer-containers).
This includes `deltalake` for reading Delta Table files and updates to Dask that can greatly reduce the memory usage for some workloads, as described in [this post](https://blog.dask.org/2022/11/15/queuing) on the Dask blog.

(future-release-notice-jan-23)=
## Breaking changes

Please be advised that in this release, we upgraded the version of our raster tiling engine, TiTiler. This results in some changes to the way rendering parameters are specified when generating image tiles. These changes affect both the [Item Tile endpoints](https://planetarycomputer.microsoft.com/api/data/v1/docs#/Item%20tile%20endpoints) and the [Mosaic Tile endpoints](https://planetarycomputer.microsoft.com/api/data/v1/docs#/PgSTAC%20Mosaic%20endpoints).

These changes do **not** affect how you use the Explorer or any links you've saved or shared via the Explorer. It only affect certain query string parameters you may have generated that hit `/api/data/` endpoints directly.

Please see the upstream changes for more information:

- [pgstac-titiler changelog](https://github.com/stac-utils/titiler-pgstac/blob/master/CHANGES.md?plain=1#L55-L63)
- [rio-tiler changelog](https://github.com/cogeotiff/rio-tiler/blob/main/docs/src/v4_migration.md#band-names)

If you have any questions, please reach out to us on our [GitHub Discussions page](https://github.com/microsoft/planetarycomputer/discussions).
