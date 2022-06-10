# Planetary Computer Data Catalog

Note: This repository serves as a reference implementation for interacting with
Planetary Computer APIs on Azure. Ths code supports the production deployment of
the Planetary Computer Data Catalog and Explorer applications. This repository
is not meant to be reusable in other situations without significant
modification, and the repository maintainers cannot provide any support for
non-development deployments of this code. Additionally, this application is under
constant development, including some significant planned refactors.

That said, it is hoped that components or examples contained here will be
helpful for users developing applications using the open-source components also
used by the Planetary Computer, or against Planetary Computer APIs themselves.
Please review the [terms of use](https://planetarycomputer.microsoft.com/terms).

To file general issues or ask questions, please visit the [Planetary Computer
repository](https://github.com/microsoft/PlanetaryComputer).

## Data Catalog

A homepage, data catalog, and visualizations for the Planetary Computer.

## Requirements

- Docker
- docker-compose

## Getting started

The entire development environment is created as part of a multi-container docker-compose setup. To
fetch and build the images, run:

```sh
./scripts/update

```

Now you can start the development server, and the site should be accessible at <http://localhost:4280>.

```sh
./scripts/server
```

If you want to run just the frontend development server on your host, ensure you have Node 14 installed and run:

```sh
npm install
npm start
```

To build the latest docs or external notebook, or if any new dependencies have been added, re-run `./scripts/update` (you may need to refresh the app in your browser if the site was running).

### Developing

There are four main components to the application:

1. [etl](etl/README.md) - downloads and processes external files to be included in the application build
2. [docs](docs/README.md) - a [sphinx](https://www.sphinx-doc.org/en/master/)-powered, markdown based documentation system
3. [api](api/README.md) - an Azure Function app that provides a lightweight backend
4. src - the main React application, bootstrapped from [Create React App](https://create-react-app.dev/)

#### Frontend development

First, copy `.env.sample` file to `.env`, and ensure the configuration values are set.

| Name | Value | Description |
|------|-------|-------------|
|`REACT_APP_API_ROOT`| <https://planetarycomputer-staging.microsoft.com> | The root URL for the STAC API, either prod, staging or a local instance.
|`REACT_APP_TILER_ROOT`| Optional | The root URL for the data tiler API, if not hosted from the domain of the STAC API.
|`REACT_APP_AZMAPS_KEY`| Retrieve from Azure Portal | The key used to authenticate the Azure Maps inset map on a dataset detail page.
|`REACT_APP_HUB_URL`| Optional. URL to root Hub instance | Used to enable a request to launch the Hub with a specific git hosted file.
|`REACT_APP_ONEDS_TENANT_KEY`| Lookup at <https://1dswhitelisting.azurewebsites.net/> | Telemetry key (not needed for dev)
|`REACT_APP_AUTH_URL`| Optional. URL to root pc-session-api instance | Used to enable login work.

Run `./scripts/server` to launch a development server.

#### Developing against local STAC assets

The `REACT_APP_API_ROOT` can be set to a local instance of the Metadata API if you are
prototyping changes to collections. However, as a shortcut, you can also run the
`./scripts/mockstac` script in order to locally serve a static json file from
`/mockstac/collections`. Simply alter the contents of the JSON file as you need,
and set your `REACT_APP_API_ROOT` value to `http://localhost:8866` and restart
your dev server.

#### Feature flags

A simple feature flag system is included in the application. To add a flagged feature during development:

1. Wrap the component to be shown or hidden with a `Feature` component, providing a `name`.
2. In `/utils/featureFlags.js` add an object to the list with `name`, `description`, and `active` (`bool`)
3. Use the script in `/extra/ff-bookmarklet.js` to toggle features on a running site
   1. Use a JS minifier like <https://javascript-minifier.com/> to minimize the file
   2. Add a new bookmark, and paste the minified JS as the URL. You'll likely need add the `javascript:` label back to the front of the screen.
4. Toggle feature flags on or off. Be sure that the site works in both states.
5. Remove the `Feature` component and the flag entry when the feature is mature enough to be included.

#### API development

To debug or extend the small API backend, please read the [API README](api/README.md).

#### Testing and linting

The project contains cypress end-to-end tests and jest based unit tests.

To run jest based unit test and perform linting and code format analysis, run `./scripts/test`.

#### Formatting

The project contains a prettier config file that is used to format code, which
should integrate with your editor.  Alternatively you can run `./scripts/format`
to format all files. The CI system will check for formatting errors.

##### Cypress

If you're on WSL2, be sure to set up your system to run the Cypress GUI:
<https://wilcovanes.ch/articles/setting-up-the-cypress-gui-in-wsl2-ubuntu-for-windows-10/>

You may also need to install cypress locally on your computer, with `npm install cypress`.

- Install Google Chrome in your WSL2 environment (Cypress ships with a chromium-based electron browser)
- Run `npm cypress:open` to run the GUI and debug tests, or
- Run `npm cypress:run` to run the headless version in the terminal

Both test suites are run from CI.

## Ports

| Service                  | Port |
|--------------------------|------|
| Webpack Dev Server       | 3000 |
| Functions App Dev Server | 7071 |
| Mock STAC API Server     | 8866 |

## Scripts

| Name    | Description                                                      |
|---------|------------------------------------------------------------------|
| `clean` | Removes intermediate build files from docs and dataset codefiles |
| `format`   | Runs black and prettier against Python and Java/TypeScript files
| `mockstac` | Serves contents of `/mockstac/collections` at <http://localhost:8866>                                          |
| `server`   | Runs frontend development server                                                                               |
| `test`     | Runs unit tests and linter                                                                                     |
| `update`   | Install dependencies and build etl and docs content. Use `--devdocs` to develop against a local notebook repo. |
| `npm *`    | Run configured `npm` commands like `npm add`, `npm lint`, `npm test`, etc                                      |

## Deploying

There are 3 Azure Static Web App services enabled, for staging, test and
production. They are configured via [the GitHub workflow
files](.github/workflows). Generally, merging to deployment branches will
initiate a build and deploy with the service framework:

- `develop`: Deploys to staging and test (`pc-datacatalog`, `pc-datacatalog-test`)
- `main`: Deploys to production (`pc-datacatalog-production`)

Opening a PR against either branch will also create an ephemeral staging environment, and a site link will be added to the PR comment section.

The release process can be managed with git flow, initialized with the default settings. To bring forth a production release, pull local `develop` and `main` to latest, and follow these steps:

- Start a release

```bash
git flow release start X.Y.Z
```

- Bump the version number in `package.json` and check it in

```bash
git status # check staging area is clean
git add package.json
git commit -m "X.Y.Z"
```

- Publish the release

```bash
git flow release publish X.Y.Z
```

- Finish and push the release branch
  - When prompted, keep default commit messages
  - Use `X.Y.Z` as the tag message

```bash
git flow release finish -p X.Y.Z
```

## Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit <https://cla.opensource.microsoft.com>.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft
trademarks or logos is subject to and must follow
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
