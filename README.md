# Planetary Computer Data Catalog

A homepage and catalog of datasets provided by the Planetary Computer. This
project is in early stages of development.

## Development setup

### Requirements

- Node v14
- Yarn

### Developing

Add a `.env` file based on the included `.env.sample` file. Set
the `REACT_APP_API_ROOT` value to either your local instance of the Planetary
Computer, or a staging/production version exposed online.

Run `yarn start` to launch a development server.

### Building

Ensure the `REACT_APP_API_ROOT` environment variable is set for the environment
being targeted.

Run `yarn build` to assemble a production asset bundle, which
will be availalbe in `/build`.

## Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

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
