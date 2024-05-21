## Deploy your own JupyterHub

Deploying your own [JupyterHub] is a good option for a team of users looking to
work with data from the Planetary Computer who need a specialized environment,
require additional computation resources, or want to tie a compute environmnt into a broader
Azure deployment while still using data from the Planetary Computer.

In this guide you will:

* Deploy an [AKS] cluster using the Azure CLI
* Deploy JupyterHub and Dask Gateway using the [daskhub] Helm chart.

We describe two deployment scenarios, a [simple](docs/concepts/hub-deployment/#simple-deployment) and a [recommended](docs/concepts/hub-deployment/#recommended-deployment) deployment. If you're new to Azure, Kubernetes, or JupyterHub, then you should try the simple deployment to verify that the basics work, before moving on to the more advanced recommended deployment. Finally, the configuration for the Planetary Computer based JupyeteHub is available on [GitHub](https://github.com/microsoft/planetary-computer-hub), which provides a reference for a real-world deployment.

For background, we recommend reading the [Zero to JupyterHub with Kubernetes][z2jh] guide and the [Dask Gateway on Kubernetes][gateway-k8s] documentation.

```{note}
Make sure to use the `westeurope` region for your Azure resources. This will place your compute
in the same region as the Planetary Computer's data.
```

### Prerequisites

We'll assume that you've completed the [prerequisites] for creating an AKS cluster. This includes:

* Obtaining an [Azure Subscription](https://docs.microsoft.com/en-us/azure/guides/developer/azure-developer-guide#understanding-accounts-subscriptions-and-billing)
* Installing and configuring the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
* Installing [kubectl](https://kubernetes.io/docs/tasks/tools/) (`az aks install-cli`)
* Installing [Helm](https://helm.sh/docs/intro/install/)

### Simple deployment

This section walks through the simplest possible deployment, but lacks basic features like authentication, HTTPS, and a user-friendly DNS name. We recommend trying this deployment to ensure that the tools work, before deleting things and moving on to the advanced deployment.

#### Kubernetes cluster

Following the [Kubernetes quickstart](https://docs.microsoft.com/en-us/azure/aks/kubernetes-walkthrough), we'll use the Azure CLI to create an AKS cluster.

For ease of reading we'll repeat the steps here, but visit the [guide](https://docs.microsoft.com/en-us/azure/aks/kubernetes-walkthrough) to build understanding about what each command does.
We'll delete this simple deployment shortly, so we recommend creating a brand-new resource group to make cleaning up easy.

```bash
# Create a Resource group
$ az group create --name pangeo --location westeurope
{
 "id": "/subscriptions/<guid>/resourceGroups/pangeo",
 "location": "westeurope",
 "managedBy": null,
 "name": "pangeo",
 "properties": {
   "provisioningState": "Succeeded"
 },
 "tags": null
}

# Create an AKS cluster
$ az aks create --resource-group pangeo --name pangeoCluster --generate-ssh-keys \
 --node-count=1 --enable-cluster-autoscaler --min-count=1 --max-count=5

# Get credentials for kubectl / helm
$ az aks get-credentials --name pangeoCluster --resource-group pangeo
```

Notice that we use `--location westeurope` to ensure the compute nodes are in the same Azure region as the Planetary Computer's data.

At this point, you should have a Kubernetes cluster up and running. Verify that things are are working OK with ``kubectl``.

```bash
$ kubectl get node
NAME                                STATUS   ROLES  AGE   VERSION
aks-nodepool1-26963941-vmss000000   Ready    agent   1m   v1.19.11
```

#### JupyterHub and Dask Gateway

Now we're ready to install JupyterHub and Dask Gateway on our AKS cluster using the [daskhub](https://helm.dask.org/) Helm chart. Visit the documentation at <https://github.com/dask/helm-chart/tree/main/daskhub> for more background about the chart, and <https://helm.sh/> for information about Helm. 

**Download or update the ``daskhub`` Helm chart**

```bash
$ helm repo add dask https://helm.dask.org
$ helm repo update
```

**Generate a secret token**

Dask Gateway needs a token to authenticate with JupyterHub.

```bash
$ openssl rand -hex 32
<secret token>
```

**Install ``daskhub``**

We'll install daskhub into a new ``dhub`` namespace, but you can use whatever namespace you like. Make sure to substitute your `<secret token>` from earlier. You can create a configuration file to pass to helm.

```yaml
# file: config.yaml
jupyterhub:
  hub:
    # Needed for dask-gateway<=0.9.0. https://github.com/dask/helm-chart/issues/142
    networkPolicy:
      enabled: false
  
    services:
      dask-gateway:
        apiToken: "<secret token from above>"
   
dask-gateway:
  gateway:
    auth:
      jupyterhub:
        apiToken: "<secret token from above>"
    backend:
      image:
        name: pangeo/base-notebook
        tag: 2021.06.05
```

Now we can deploy JupyterHub and Dask Gateway with Helm.

```bash
$ helm upgrade --wait --install --create-namespace \
      dask dask/daskhub \
      --namespace dhub \
      --values config.yaml

Release "dask" does not exist. Installing it now.
NAME: dask
LAST DEPLOYED: Fri Jun  4 14:21:33 2021
NAMESPACE: dhub
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
DaskHub
-------

Thank you for installing DaskHub, a multiuser, Dask-enabled JupyterHub!

Your release is named dask and installed into the namespace dhub.


Jupyter Hub
-----------

You can find if the hub and proxy is ready by doing:

kubectl --namespace=dhub get pod

and watching for both those pods to be in status 'Ready'.

You can find the public IP of the JupyterHub by doing:

kubectl --namespace=dhub get svc proxy-public

It might take a few minutes for it to appear!
```

The instructions printed above show how to get the IP address of your hub.

```{warning} This simple deployment doesn't have any kind of authentication. See the [recommended deployment](docs/concepts/hub-deployment/#recommended-deployment) for instructions on creating a deployment with authentication.
```

When you log in (using any username and password, since we don't have authentication yet) and start a notebook sever, you should be able to connect to the Dask Gateway server and create a cluster.

```python
>>> from dask_gateway import Gateway
>>> gateway = Gateway()
>>> gateway.list_clusters()
[]
>>> cluster = gateway.new_cluster()
>>> client = cluster.get_client()
>>> cluster.scale(1)
```

After a moment, the Dask scheduler and worker pods should start up. Check the pods with ``kubectl -n dhub get pods``.

#### Cleanup

The easiest way to clean up the resources is to delete the resource group.

```bash
$ az group delete -n pangeo
```

### Recommended deployment

This deployment is a bit more more complicated. Compared to the simple deployment, it adds:

1. Support for HTTPS
2. Use of a host name rather than an IP Address
3. Authentication with Azure Active Directory
4. Multiple Kubernetes node pools, using spot (preemptible) nodes for workers to save on costs

### Azure resources

In this section we'll use the Azure CLI to create a resource group and AKS cluster, and the Azure Portal to create an app registration. This is a nice way to build familiarity with the underlying services, but you might consider using a tool like [Terraform](https://www.terraform.io/) and the [Azure Provider for Terraform](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs) to configure your Azure resources.

**Create a resource group**

```bash
# Create a resource group
$ az group create --name pangeo --location westeurope
{
 "id": "/subscriptions/<subscriptionId>/resourceGroups/pangeo",
 "location": "westeurope",
 "managedBy": null,
 "name": "pangeo",
 "properties": {
   "provisioningState": "Succeeded"
 },
 "tags": null,
}
```

**Create an app registration**

To authenticate users, we'll create app registration for the Microsoft Identity Platform in the Azure Portal following [these instructions](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app).
In this example, the *sign-in audience* will be **accounts in this organizational directory only**. This is appropriate when you are administering a Hub for other users within your tenant. By default, all users with a directory will be able to log into your Hub. You can manage access using [Azure Active Directory groups](https://docs.microsoft.com/en-us/azure/active-directory/fundamentals/active-directory-manage-groups).

When creating a new app registration, you'll be asked for a redirect URI. This URI should match where your users will access the Hub. If your organization already has a DNS provider, use that. Alternatively, you can have Azure handle the DNS for your Hub service automatically, which is what we'll use in this guide. We're calling our cluster ``pangeo-hub`` and deploying it in West Europe, so the callback URL is ``https://pangeo-hub.westeurope.cloudapp.azure.com/hub/oauth_callback``.  In general the pattern is ``https://<hub-name>.<azure-region>.cloudapp.azure.com/hub/oauth_callback``.

If you need to further customize the platform settings, do so under the "Web" platform. The JupyterHub server will be the web server in this context.

Finally, create a client secret to pass to JupyterHub: Under the *Manage* section, select *Certificates and Secrets* then *New client secret*. We'll use the ``Value`` later on.
You will also need the app registration's ``Client ID`` and ``Tenant ID``, which are available on the app registration's main page, under *Essentials*.

To summarize, we now have our app registration's:

- Client ID
- Tenant ID
- Client secret
- OAuth callback URL

For more on authentication see [Authentication and Authorization](https://zero-to-jupyterhub.readthedocs.io/en/latest/administrator/authentication.html) in the JupyterHub documentation, in particular the section on [Azure AD](https://zero-to-jupyterhub.readthedocs.io/en/latest/administrator/authentication.html#azure-active-directory).

**Create a Kubernetes Cluster**

Now we'll create a Kubernetes cluster. Compared to last time, we'll have three node pools:

* A "core" pool for JupyterHub pods (the Hub, etc.) and Kubernetes itself
* A "user" pool for user pods and Dask schedulers
* A preemptible "worker" pool for Dask workers

```bash
# Create an AKS cluster
$ az aks create --resource-group pangeo --name pangeoCluster --generate-ssh-keys \
 --node-count=1 \
 --nodepool-name core \
 --nodepool-labels hub.jupyter.org/node-purpose=core

# Add a node pool: one for the users and Dask schedulers
$ az aks nodepool add \
   --name users \
   --cluster-name pangeoCluster \
   --resource-group pangeo \
   --enable-cluster-autoscaler \
   --node-count 1 \
   --min-count 0 --max-count 10 \
   --node-vm-size Standard_D2s_v3 \
   --labels hub.jupyter.org/node-purpose=user

# Add a node pool for Dask workers
$ az aks nodepool add \
   --name workers \
   --cluster-name pangeoCluster \
   --resource-group pangeo \
   --enable-cluster-autoscaler \
   --node-count 1 \
   --min-count 0 --max-count 50 \
   --node-vm-size Standard_D2s_v3 \
   --priority Spot \
   --eviction-policy Delete \
   --spot-max-price -1 \
   --labels="k8s.dask.org/dedicated=worker"
```

At this point, you should have a functioning Kubernetes cluster with multiple node pools. For example:

```bash
$ az aks get-credentials \
   --name pangeoCluster \
   --resource-group pangeo \
   --output table

$ kubectl get node
NAME                              STATUS   ROLES   AGE     VERSION
aks-core-26963941-vmss000000      Ready    agent   15m     v1.19.11
aks-users-26963941-vmss000000     Ready    agent   8m19s   v1.19.11
aks-workers-26963941-vmss000000   Ready    agent   3m3s    v1.19.11
```

#### Deploy DaskHub

Now that we have our Azure resources in place, we can deploy JupyterHub and Dask Gateway.

**Get the Helm chart**

Download or update the ``daskhub`` helm chart.

```bash
$ helm repo add dask https://helm.dask.org
$ helm repo update
```

**Generate a secret token**

Dask Gateway needs a token to authenticate with JupyterHub.

```bash
$ openssl rand -hex 32
<secret token>
```

**Create a configuration file**

This configuration file is used to customize the deployment with Helm. You can start with the {download}`reference config file<advanced/config.yaml>`.

```{warning}
   For simplicity, we've included all of the configuration values
   in a single `config.yaml` file, including sensitive values. We recommend
   keeping the sensitive values in a separate, encrypted file that's decrypted
   just when deploying.
```

```{literalinclude} advanced/config.yaml
   :language: yaml
```

**Install ``daskhub``**

We'll install it into a new ``dhub`` namespace, but you can use whatever namespace you like.

```bash
$ helm upgrade --wait --install --create-namespace \
      dask dask/daskhub \
      --namespace dhub \
      --values config.yaml
```

Verify that all the pods are running with:

```bash
$ kubectl -n dhub get pod
NAME                                           READY   STATUS    RESTARTS   AGE
api-dask-dask-gateway-947887bf9-f748w          1/1     Running   0          18m
autohttps-66bd64d49b-wskqc                     2/2     Running   0          18m
continuous-image-puller-nwq4l                  1/1     Running   0          18m
controller-dask-dask-gateway-ccf4595c8-lx2h7   1/1     Running   0          18m
hub-56d584b5b5-7rxvk                           1/1     Running   0          18m
proxy-5b4bb9b8bb-q8r7x                         1/1     Running   0          18m
traefik-dask-dask-gateway-d9d4cc45c-whmmw      1/1     Running   0          18m
user-scheduler-86c6bc8cd-h6dx2                 1/1     Running   0          18m
user-scheduler-86c6bc8cd-hhhbn                 1/1     Running   0          18m
```

```{note}
   If you see an HTTPS error accessing the hub, you may need to recreate the `autohttps` pod created by JupyterHub.
   The command `kubectl -n dhub delete pod -l app=jupyterhub,component=autohttps` will recreate the `autohttps` pod,
   which should then get a certificate to serve your site over HTTPS.
```

When you log in and start a notebook sever, you should be able to connect to the Dask Gateway server and create a cluster.

```python
>>> from dask_gateway import Gateway
>>> gateway = Gateway()
>>> gateway.list_clusters()
[]
>>> cluster = gateway.new_cluster()
>>> client = cluster.get_client()
>>> cluster.scale(1)
```

After a moment, the Dask scheduler and worker pods should start up. Check the pods with ``kubectl -n dhub get pods``.

#### Cleanup

The easiest way to clean up the resources is to delete the resource group.

```bash
$ az group delete -n pangeo
```

### Next steps

Your AKS cluster and JupyterHub deployments can be customized in various ways. Visit the the [Azure Kubernetes Service overview ](https://docs.microsoft.com/en-us/azure/aks/intro-kubernetes) for more on AKS, [Zero to JupyterHub with Kubernetes][z2jh] documentation for more on JupyterHub and the JupyterHub helm chart, and [Dask Gateway][gateway] for more on Dask Gateway.

[AKS]: https://docs.microsoft.com/en-us/azure/aks
[daskhub]: https://github.com/dask/helm-chart/tree/main/daskhub
[gateway-k8s]: https://gateway.dask.org/install-kube.html
[gateway]: https://gateway.dask.org/
[JupyterHub]: https://jupyterhub.readthedocs.io/en/stable/
[prerequisites]: https://docs.microsoft.com/en-us/azure/aks/kubernetes-walkthrough#prerequisites
[z2jh]: https://zero-to-jupyterhub.readthedocs.io/en/latest/index.html
