# Overview

## Setup and dependencies

Python dependencies are encoded in `etl/requirements.txt` file, but generally managed
by the [`etl Dockerfile`](../etl/Dockerfile).

## Understanding the documentation system

1. Source files for the documentation are .md and .ipynb files stored in the `/docs` directory
2. The `/build_docs` script uses `sphinx` to generate JSON documents containing the converted HTML docs
3. The script copies the JSON documents to this `/src/docs` directory
4. When the application in built, all `*.json` files are imported via Webpack
5. The JSON/HTML is rendered within the application, and any `reference internal` links are handled by React Router

## Adding documentation

To add documentation, commit markdown or ipynb files directly to the
`docs/api` or `docs/hub` directories. These files can include directives
as allowed by [My-ST Parser](https://myst-parser.readthedocs.io/en/latest/).
Manually edit the `index.md` file to include the new documentation pages into
the Table of Contents.

To generate the rendered docs and incorporate them into the application for
development, run `./scripts/update` script. The generated markup is not
checked into the repository, but is build and bundled during the CI build
process for production.

### Documentation tips

- Add references to images as relative paths at `images/<image-name>.png`
- Add an alt text to all images (`![my alt text](example.com)`)
- Don't use bare URLs; if not using an actual href, surround the url in
brackets
- Notebook files are supported. Make sure they are in an executed
state, as the build process does not execute them. In-line base64 encoded images are acceptable, they will automatically be persisted to a file in the application build directory to keep the bundle size small.
