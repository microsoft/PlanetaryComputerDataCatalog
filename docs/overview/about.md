# About the Microsoft Planetary Computer

The Microsoft Planetary Computer is a platform that lets users leverage the power of the cloud to accelerate environmental sustainability and Earth science.

The Planetary Computer consists of four major components:

- The [Data Catalog](https://planetarycomputer.microsoft.com/catalog), which includes petabytes of data about Earth systems, hosted on Azure and made available to users for free.
- [APIs](../concepts/stac.md) that allow users to search for the data they need across space and time.
- [Applications](https://planetarycomputer.microsoft.com/applications), built by our network of partners, that put the Planetary Computer platform to work for environmental sustainability.

## Built on Open

The Planetary Computer uses open source tools and supports open standards. In fact, the foundation of the Planetary Computer is the incredible ecosystem of tools being developed in the open by our partners and the much broader open source community. For example, our API builds on the work done by the [STAC](https://stacspec.org/) community to streamline and standardize the cataloging and discovery of geospatial data.

Many of the Planetary Computer components are also open-source. These provide guidance on how to tie together open-source libraries on Azure for geospatial and environmental data analysis.

| GitHub repository                                                                                     | Purpose                                                                                                                                                                                |
|-------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Microsoft/planetary-computer-apis](https://github.com/Microsoft/planetary-computer-apis)             | Deploys the [STAC](https://planetarycomputer.microsoft.com/docs/reference/stac/) and [data](https://planetarycomputer.microsoft.com/docs/reference/data/) APIs                         |
| [Microsoft/PlanetaryComputerExamples](https://github.com/microsoft/planetarycomputerexamples)         | Contains notebooks with examples for each dataset, quickstarts, and tutorials for using the Planetary Computer                                                                         |

## About the Preview

The Planetary Computer data and APIs are publicly accessible and can be used without an account, including:

- The [STAC API](../reference/stac) is public and can be accessed anonymously.
- Most data can be downloaded anonymously, but will be throttled. See [Reading data from the STAC API](../quickstarts/reading-stac.ipynb) for an introduction and [Using Tokens for Data Access](../concepts/sas) for more background on accessing data.

We're just getting started. Check back for updated documentation and new features!

```{tip} To report issues, ask questions, or engage in community discussions please visit our [GitHub repository](https://github.com/microsoft/PlanetaryComputer).
```

## Next steps

- [Browse the data available in the Planetary Computer through the Data Catalog](https://planetarycomputer.microsoft.com/catalog)
- [Learn how to search for Planetary Computer data using the STAC API](../quickstarts/reading-stac.ipynb)
- Check out the example notebooks for our datasets, for example:
  - [Landsat Collection 2 Level-2](https://planetarycomputer.microsoft.com/dataset/landsat-c2-l2#Example-Notebook)
  - [Sentinel-2  L2A](https://planetarycomputer.microsoft.com/dataset/sentinel-2-l2a#Example-Notebook)
  - [NAIP](https://planetarycomputer.microsoft.com/dataset/naip#Example-Notebook)
  - [ASTER L1T](https://planetarycomputer.microsoft.com/dataset/aster-l1t#Example-Notebook)

## Beyond the Planetary Computer

The Planetary Computer is just one component of Microsoft's commitment to environmental sustainability.

- Learn more about Microsoft's [environmental sustainability program](https://www.microsoft.com/en-us/corporate-responsibility/sustainability).
- Learn more about the work done by AI for Earth grantees at the [AI for Earth grantee gallery](https://aka.ms/ai4egrantees).
- Microsoft's [AI for Earth program](https://aka.ms/aiforearth) also provides open source technical resources for conservation work; check out our [machine learning APIs](https://aka.ms/ai4eapis), and read about our tools for [accelerating biodiversity surveys with AI](https://aka.ms/biodiversitysurveys) and [AI-accelerated land cover analysis](https://aka.ms/landcovermapping).

## Cite the Planetary Computer

If the Planetary Computer is useful for your work, please cite it using [this record](https://zenodo.org/record/7261897) on Zendo. Here's a BibTeX entry for your reference:

```bibtex
@software{microsoft_open_source_2022_7261897,
  author       = {Microsoft Open Source and
                  Matt McFarland and
                  Rob Emanuele and
                  Dan Morris and
                  Tom Augspurger},
  title        = {microsoft/PlanetaryComputer: October 2022},
  month        = oct,
  year         = 2022,
  publisher    = {Zenodo},
  version      = {2022.10.28},
  doi          = {10.5281/zenodo.7261897},
  url          = {https://doi.org/10.5281/zenodo.7261897}
}
```
