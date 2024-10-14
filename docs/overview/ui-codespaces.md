# Use GitHub Codespaces

[GitHub Codespaces][codespaces] is a development environment that's hosted in the cloud.

The easiest way to get started is to [fork] the [Planetary Computer Examples][examples] repository and create a new Codespace (we recommend [setting a default region](#set-a-default-region) first).

![Start codespaces from the "Code" dropdown.](images/codespaces-start.png)

This will create a Codespace under your GitHub account that's configured to work well with our data.

![A preview of GitHub Codespaces in the browser.](images/codespaces-browser.png)

When you launch a notebook, you'll be prompted to select a kernel. Choose the `'notebook': conda` kernel.

## Set a default region

We recommend that you create your Codespaces in the West Europe region. You can do this per-Codespace, or set a [default region][region].

![Set the default region](images/codespaces-region.png)

This ensures that your compute node is in the same Azure region as the data, giving the highest performance when accessing data from the [Planetary Computer catalog][catalog].

## Use Planetary Computer environments

Your Codespace uses a [dev container][container] to provide all the software and tools needed to do your data analysis and software development.

We publish our environments, which contain many packages useful for geospatial data analysis, at <https://github.com/microsoft/planetary-computer-containers>. These can be used in the Codespaces [configuration] for your project to ensure you have access to those packages.

[catalog]: https://planetarycomputer.microsoft.com/catalog
[codespaces]: https://github.com/features/codespaces
[configuration]: https://docs.github.com/en/codespaces/customizing-your-codespace/configuring-codespaces-for-your-project
[container]: https://docs.github.com/en/codespaces/customizing-your-codespace/configuring-codespaces-for-your-project#about-dev-containers
[examples]: https://github.com/microsoft/planetarycomputerexamples
[fork]: https://guides.github.com/activities/forking/
[region]: https://docs.github.com/en/codespaces/managing-your-codespaces/setting-your-default-region-for-codespaces
