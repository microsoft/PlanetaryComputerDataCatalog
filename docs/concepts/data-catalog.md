
## Data Catalog

The Planetary Computer provides key geospatial and conservation datasets,
free of charge and powered by the Azure cloud. Visit the [Data
Catalog](https://planetarycomputer.microsoft.com/catalog) to discover what
data is currently available and to review important metadata about their
content, including what specific assets are included. Each dataset also
includes runnable example code showing how to access and use the data with
other Planetary Computer components.

Read more about how the Planetary Computer uses open-source tools to make
[finding](../quickstarts/reading-stac.ipynb) and [using](./computing.md) our
data easy and approachable.

### Access patterns

During our Private Preview, we are focused on making our largest datasets
indexed and searchable using the open [STAC specification](https://stacspec.org/).
These search and access API endpoints lower the barrier to finding specific
data you need over large spatial and temporal extents. The data itself is
still stored on Azure Blob Storage and can be used with existing, familiar
tools.

While not yet available to be searched by our STAC API, the Planetary
Computer also hosts and documents dozens of additional datasets important to
environmental sustainability and Earth science. These datasets can be used
alongside the STAC indexed data, or any other data you have. We'll be
incorporating these important datasets into the STAC API over the coming
months.

While freely accessible, we do require tokens to access some data sets. Read
more about [using tokens for data access](sas.md).

### Future plans

As the Private Preview develops, we are working with partners to develop and
onboard new datasets into the Planetary Computer, and make them discoverable
and accessible through open APIs. We're also developing features that will
allow users to perform analysis and generate visualizations directly from the
Data Catalog.

If you have feedback about our existing datasets, or are interested in seeing
additional datasets, contact us at <a href="mailto:aiforearthdatasets@microsoft.com">aiforearthdatasets@microsoft.com</a>.
