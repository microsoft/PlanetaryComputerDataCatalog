% Each `{toctree}` block will be rendered as a heading with specified by :caption
% Override a document's heading title with the syntax: Custom Title <path/to/file>
% You can add new toctree elements, or combine files from different directories under one.

```{toctree}
:maxdepth: 1
:caption: Overview

About <overview/about>
```

```{toctree}
:maxdepth: 1
:caption: Querying data 

api/query
Example Notebook <api/aster-test>
```

```{toctree}
:maxdepth: 1
:caption: Reading data

api/read

```

```{toctree}
:maxdepth: 1
:caption: Hub docs 

hub/computing
```

```{toctree}
:maxdepth: 1
:caption: API Reference

Metadata API <reference/stac>
SAS API <reference/sas>
```
