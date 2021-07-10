% Each `{toctree}` block will be rendered as a heading with specified by :caption
% Override a document's heading title with the syntax: Custom Title <path/to/file>
% You can add new toctree elements, or combine files from different directories under one.
% The relative paths to documents needs to be valid at build-time. Some documents are synced
% from external sources and merged into a working directory at build-time. The paths here
% represent their post-merge location, and may not refer to files that are checked-in to this
% repository.


```{toctree}
:maxdepth: 1
:caption: Overview

About <overview/about>
The Hub <overview/environment>
Using VS Code <overview/ui-vscode>
Changelog <overview/changelog>
```

```{toctree}
:maxdepth: 1
:caption: Quickstarts

Reading from the STAC API <quickstarts/reading-stac>
quickstarts/reading-zarr-data
quickstarts/reading-tabular-data
quickstarts/scale-with-dask
quickstarts/storage
```

```{toctree}
:maxdepth: 1
:caption: Tutorials

tutorials/cloudless-mosaic-sentinel2
tutorials/landcover
```

```{toctree}
:maxdepth: 1
:caption: Concepts

concepts/data-catalog
concepts/computing
concepts/sas
```

```{toctree}
:maxdepth: 1
:caption: API Reference

STAC API <reference/stac>
Data Authentication API <reference/sas>
Data API <reference/data>
```
