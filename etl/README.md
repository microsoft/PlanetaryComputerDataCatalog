# Data Catalog ETL

The ETL process fetches remote Jupyter notebooks and converts them to HTML
files ready to be integrated into the Data Catalog app.

## Dependencies

- wget
- Python3

## Process notebook files

1. Install requirements in `etl/requirements.txt`

   ```console
   pip install -r requirements.txt
   ```

2. Run `./process_notebooks.sh`
3. Check the `metadata/notebooks` directory for the output HTML files

## Adding/Removeing notebooks

Each line in `notebook_urls.txt` decscribes a notebook to download and
convert. Filenames are preserved after conversion (`[name].ipynb -->
[name].html`). To render notebooks in specific parts of the Data Catalog
application, you will typically need to edit the `config/site.yml` file and
section relevant to your data.

## Notebook HTML files at build-time

When building the application code, the Webpack configuration instructs all
HTML files in the `metadata/notebooks` directory to be copied to the
`static/metadata` directory in the build directory. As a result, they are
included in the assets package (though not bundled, since they are not
directly imported in code). They are typically loaded into the application
via an HTTP fetch at `./static/metadata/[name].html`.
