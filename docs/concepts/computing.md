# Computing with the Planetary Computer

The core components of the Planetary Computer are the datasets and APIs for querying them. This document provides an overview of the various ways you can compute on data hosted by the Planetary Computer.

Regardless of how you compute on the data, to ensure maximum efficiency you should locate your compute as close to the data as possible. Most of the Planetary Computer Data Catalog is hosted in Azure's **West Europe** region, so your compute should be there too.

## Use your own compute

For production workloads, we recommend deploying your own compute, which gives you more control over the hardware and software environment.

See [Scaling with Dask](../quickstarts/scale-with-dask.md) for an introduction to Dask. This setup was pioneered by the [Pangeo Community](https://pangeo.io/). The [Pangeo Cloud](https://pangeo.io/cloud.html) documention provides additional background on how to use Dask-enabled JupyterHubs.

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
