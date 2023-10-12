# Computing on the Planetary Computer

The core components of the Planetary Computer are the datasets and APIs for querying them. This document provides an overview of the various ways you can compute on data hosted by the Planetary Computer.

Regardless of how you compute on the data, to ensure maximum efficiency you should locate your compute as close to the data as possible. Most of the Planetary Computer Data Catalog is hosted in Azure's **West Europe** region, so your compute should be there too.

## Use our JupyterHub

The [Planetary Computer Hub](https://planetarycomputer.microsoft.com/compute) is a [JupyterHub](https://jupyterhub.readthedocs.io/en/stable/) deployment in the West Europe Azure region. This is the easiest way to get started with computing on the Planetary Computer.
That said, the Planetary Computer Hub is focused mainly on convenience. We recommend it for prototypes and exploration, but production workloads should use one of the compute options detailed below in [Use your own compute](#use-your-own-compute).


```{note} You'll need to [request access](https://planetarycomputer.microsoft.com/account/request) to use the Planetary Computer Hub.
```

Once approved, you can log into the JupyterHub with your credentials. You'll get a computing environment that includes standard scientific and geospatial packages from one of the [Pangeo Docker Images](https://github.com/pangeo-data/pangeo-docker-images#pangeo-docker-images).

For scalable computation, the JupyterHub is also configured with [Dask Gateway](https://gateway.dask.org/). To create a Dask Cluster:

```python
>>> from dask_gateway import GatewayCluster

>>> cluster = GatewayCluster()  # Creates the Dask Scheduler. Might take a minute.
>>> client = cluster.get_client()
>>> cluster.adapt(minimum=1, maximum=100)
>>> cluster
GatewayCluster<prod.fbfed27704fc4d1da027dad20471993b, status=running>
```

With this setup, all of the computation happens on Azure, whether on a single node or on a cluster with Dask.

![Diagram showing compute components within Azure](images/jupyterhub-diagram.png)

See [Scaling with Dask](../quickstarts/scale-with-dask.md) for an introduction to Dask. This setup was pioneered by the [Pangeo Community](https://pangeo.io/). The [Pangeo Cloud](https://pangeo.io/cloud.html) documention provides additional background on how to use Dask-enabled JupyterHubs.

## Use VS Code to connect to a remote Jupyter Kernel

See [Using VS Code](../overview/ui-vscode) for how to use Visual Studio Code as a user interface for the Planetary Computer's Compute.

## Use our Dask Gateway

In this setup, you only use the Planetary Computer's scalable compute. You don't log into JupyterHub. Instead, your local machine drives the computation.
We recommend this approach for users who value, and are comfortable with, managing a local development environment. This setup requires a bit more care on your part: You need to ensure that the versions of libraries in your local environment are compatible with the versions running in Azure. While not required, we recommend using the container images published at [Microsoft/planetary-computer-containers](https://github.com/microsoft/planetary-computer-containers). The example here will create a local jupyterlab session using the `mcr.microsoft.com/planetary-computer/python` image.

### Request a token from JupyterHub

Visit <https://planetarycomputer.microsoft.com/compute/hub/token> to generate a token. You'll be required to authenticate to generate a token.

![JupyterHub Admin page to generate a token.](images/hub-token.png)

Substitute that token anywhere you see `<JUPYTERHUB_API_TOKEN>` below.

### Connect to the Gateway

Similar to before, we'll use `dask_gateway` to connect. Only now we need to provide the URLs explicitly. You can specify them in code, or as environment variables.

This next snippet starts up jupyterlab at `localhost:8888` using the `mcr.microsoft.com/planetary-computer/python` container. It also mounts the current
working directory as a volume, so you can access your local files.

```console
$ export JUPYTERHUB_API_TOKEN=<JUPYTERHUB_API_TOKEN> from above
$ docker run -it --rm \
    -p 8888:8888 \
    -e JUPYTERHUB_API_TOKEN=$JUPYTERHUB_API_TOKEN \
    -e DASK_GATEWAY__AUTH__TYPE="jupyterhub" \
    -e DASK_GATEWAY__CLUSTER__OPTIONS__IMAGE="mcr.microsoft.com/planetary-computer/python:latest" \
    -e DASK_GATEWAY__ADDRESS="https://pccompute.westeurope.cloudapp.azure.com/compute/services/dask-gateway" \
    -e DASK_GATEWAY__PROXY_ADDRESS="gateway://pccompute-dask.westeurope.cloudapp.azure.com:80" \
    mcr.microsoft.com/planetary-computer/python:latest \
    jupyter lab --no-browser --ip="0.0.0.0"
```

That will print out a URL you can follow to access your local jupyterlab. From there, you can 

```python
>>> import dask_gateway
>>> gateway = dask_gateway.Gateway()
>>> cluster = gateway.new_cluster()
>>> client = cluster.get_client()
```

From here on, computations using Dask will take place on the cluster. When you `.compute()` a result and bring it back locally,
it will come to the Python process running on your local machine. Ideally the results returned locally are small enough that the
lower bandwidth between Azure and your local machine aren't a bottleneck.

![Diagram showing Compute on Azure without JupyterHub](images/gateway-diagram.png)

## Use your own compute

The previous methods relied on compute provided by the Planetary Computer, which is a great way to get started with the Planetary Computer's APIs and Data.
For production workloads, we recommend deploying your own compute, which gives you more control over the hardware and software environment.

### Using GitHub Codespaces

See [Use GitHub Codespaces](../overview/ui-codespaces) for how to use [GitHub Codespaces][codespaces] as a user interface and execution environment using data from the on the Planetary Computer catalog.

### Using Azure Machine Learning

If you have an existing [Azure Machine Learning](https://docs.microsoft.com/en-us/azure/machine-learning/) workspace, you can use it to access data and APIs hosted by the Planetary Computer.
Here we show accessing the Planetary Computer's Metadata API from Azure Machine Learning Studio.

![Image showing Azure ML Studio accessing Planetary Computer metadata](images/aml.png)

Under this scenario, we're using Azure Machine Learning Studio to connect to a virtual machine running in Azure. That virtual machine has a high-bandwidth connection to the Planetary Computer Data and Metadata APIs.

![Diagram showing Azure ML](images/aml-diagram.png)

### Using Dask Cloud Provider

Users with requiring specialized software environments or a lot of compute can use their own resources to access the Planetary Computer's Data and Metadata APIs.

In this example, we use `Dask Cloud Provider` to create a Dask cluster with just an Azure subscription. After following the setup instructions at <https://cloudprovider.dask.org/en/latest/azure.html>, you can create your cluster:

```python
>>> from dask_cloudprovider.azure import AzureVMCluster
>>> cluster = AzureVMCluster(resource_group="<resource group>",
...                          vnet="<vnet>",
...                          security_group="<security group>",
...                          n_workers=1)
Creating scheduler instance
Assigned public IP
Network interface ready
Creating VM
Created VM dask-5648cc8b-scheduler
Waiting for scheduler to run
Scheduler is running
Creating worker instance
Network interface ready
Creating VM
Created VM dask-5648cc8b-worker-e1ebfc0e
```

and connect to it

```python
>>> from dask.distributed import Client
>>> client = Client(cluster)
```

Like the previous setup, the Dask scheduler and workers are running in Azure near the data. The local client might be outside of Azure.

![Diagram showing compute with self-managed Dask cluster](images/cloudprovider-diagram.png)

[codespaces]: https://github.com/features/codespaces
