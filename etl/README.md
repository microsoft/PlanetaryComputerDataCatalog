# Data Catalog ETL

The ETL process fetches remote Jupyter notebooks and converts them to HTML
files ready to be integrated into the Data Catalog app. Markdown (.md) files
can also be downloaded and converted to HTML during the Webpack build process.

The process is also responsible for building the documentation site using sphinx.

## Dependencies

- Docker
- docker-compose

## Process notebook, markdown, and doc files

```sh
./scripts/update
```

## Adding/Removing codefiles

Each line in `codefiles_urls.txt` decscribes a .ipynb or .md to download and
convert. Filenames are preserved after conversion (`[name].ipynb -->
[name].html`). To render content in specific parts of the Data Catalog
application, you will need to edit the `config/<configfile>.yml` file at the
section relevant to your data.

## Notebook HTML files at build-time

When building the application code, the Webpack configuration instructs all
HTML files in the `etl/_codefile_output` directory to be copied to the
`static/metadata` directory in the build directory. As a result, they are
included in the assets package (though not bundled, since they are not
directly imported in code). They are typically loaded into the application
via an HTTP fetch at `./static/metadata/[name].html`.
