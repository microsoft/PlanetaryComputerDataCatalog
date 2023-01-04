# Data Catalog ETL

The ETL process fetches remote Jupyter notebooks and converts them to HTML
files ready to be integrated into the Data Catalog app. Markdown (.md) files
can also be downloaded and converted to HTML during the Webpack build process.
These external files are referred to as `codefiles` in this documentation, and
are typically rendered on tabs within a dataset detail page.

The process is also responsible for building the documentation site using sphinx.
Read more about that build process in the [`docs README`](../docs/README.md).

## Dependencies

- Docker
- docker-compose

## Process notebook, markdown, and doc files

```sh
./scripts/update
```

## Build external notebook doc files locally

While developing notebooks to be used as rendered documentation, it may be
useful to keep those documents in a publicly available GH repo. We often
develop these notebooks in the
[PlanetaryComputerExamples](https://github.com/microsoft/PlanetaryComputerExamples)
repository, as it is mounted in the Hub, and can easily be launched from the docs site.
To associate these external notebooks with the docs site, add an entry to [`external_docs_config.yml`](./config/external_docs_config.yml).

```yaml
- file_url: quickstarts/reading-zarr-data.ipynb
```

You can set the URL to a relative path assumed to be from
`https://raw.githubusercontent.com/microsoft/PlanetaryComputerExamples/main/`.
If there are external images there is an additional option to specify a list of
relative image URLs.

```yaml
- file_url: tutorials/landcover.ipynb
  image_urls:
    - tutorials/images/change.png
    - tutorials/images/another.png
```

### Developing doc notebooks locally

The PlanetaryComputerExamples project includes a dev environment that facilitates developing notebooks. To render and visualize in-progress local notebooks, that project ships with a local webserver that will serve out file contents compatible with the docs site builder. 

1. Stop the PlanetaryComputerDataCatalog if it is running.
2. In the PlanetaryComputerExamples main folder, run the `./scripts/server` command. Don't stop until you've completed all of the steps.
3. Run the command `./scripts/update --devdocs` in the PlanetaryComputerDataCatalog main folder.
4. Finally, use the `./scripts/server` command to start the local Data Catalog.

Following these steps, the local Data Catalog will assume all external notebook docs are served through the local server (http://localhost:8889) that we hosted in the second step.

## Adding/Removing codefiles

Each line in `codefiles_urls.txt` describes a .ipynb or .md to download and
convert.  Filenames are preserved after conversion (`[name].ipynb -->
[name].html`).  To render content in specific parts of the Data Catalog
application, you will need to edit the `config/<configfile>.yml` file at the
section relevant to your data.  Note that these "codefiles" are not
associated with the docs site.  These are typically rendered in arbitrary
tabs on dataset pages.

## Notebook HTML files at build-time

When building the application code, the Webpack configuration instructs all
HTML files in the `etl/_codefile_output` directory to be copied to the
`static/metadata` directory in the build output directory. As a result, they are
included in the assets package (though not bundled, since they are not
directly imported in code). They are typically loaded into the application
via an HTTP fetch at runtime from `./static/metadata/[name].html`.
