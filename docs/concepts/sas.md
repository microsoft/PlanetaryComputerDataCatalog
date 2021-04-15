## Using tokens for data access

The data hosted by the Planetary Computer is free for anyone to use. We do require that users utilize a [Shared Access Signature (SAS) Token](https://docs.microsoft.com/en-us/azure/storage/common/storage-sas-overview#how-a-shared-access-signature-works) to authorize requests to [Azure Blob Storage](https://docs.microsoft.com/en-us/azure/storage/blobs/), which stores and serves all of our data assets. This enables the AI for Earth team to monitor and control rate of egress from our West Europe data center, where our data is located.

The Data Authentication API enables users to create access tokens that can be used to read Planetary Computer data. Getting a token is a simple HTTP GET request or a single method call to the [planetary-computer](https://github.com/microsoft/planetary-computer-sdk-for-python) Python package. Anyone can get a token from our Data Authentication API - you don't have to be a registered Planetary Computer user to get an access token. If you are a registered user, and/or if you are requesting data inside the West Europe Azure Region, the rate limiting and token expiry will be more favorable to doing large-scale work with our data.


### When a token is needed

A SAS token is needed whenever you want to access Planetary Computer data at an Azure Blob URL. For example, an Azure Blob URL looks like:

<https://landsateuwest.blob.core.windows.net/landsat-c2/level-2/standard/oli-tirs/2021/141/045/LC08_L2SP_141045_20210329_20210402_02_T1/LC08_L2SP_141045_20210329_20210402_02_T1_SR_B1.TIF>

### Requesting a token

> [https://planetarycomputer.microsoft.com/api/sas/v1/token/{collection_id}](../reference/sas.md)
> [https://planetarycomputer.microsoft.com/api/sas/v1/token/{storage_account}/{container}](../reference/sas.md)

The `token` endpoint allows for the generation of a SAS token for a given dataset identified by it's STAC collection ID. If you know the Azure Blob storage account and container where the data is located, you can also use the endpoint that takes that information in its path.

The token generated with these endpoints can then be used for all requests for that same dataset. For example, to obtain a SAS token for the `naip` dataset, a request can be made to: <https://planetarycomputer.microsoft.com/data/v1/token/naip>. If you click on that link, you should see something like:

```json
{
    "msft:expiry":"2021-04-08T18:49:29Z",
    "token":"se=2021-04-08T18%3A49%3A29Z&sp=rl&sv=2020-02-10&sr=c&skoid=cccccccc-dddd-4444-aaaa-eeeeeeeeeeee&sktid=***&skt=2021-04-08T17%3A47%3A29Z&ske=2021-04-09T17%3A49%3A29Z&sks=b&skv=2020-02-10&sig=bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb%3D"
}
```

The `token` field is the SAS token. The `msft:expiry` field specifies the time (in UTC) this token expires.

When combining the URL with the SAS token, remembering to place a `?` in between will result in: `https://naipeuwest.blob.core.windows.net/naip/01.tif?se=2021-04-08T18%3A49%3A29Z&sp=rl&sv=2020-02-10&sr=c&skoid=cccccccc-dddd-4444-aaaa-eeeeeeeeeeee&sktid=***&skt=2021-04-08T17%3A47%3A29Z&ske=2021-04-09T17%3A49%3A29Z&sks=b&skv=2020-02-10&sig=bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb%3D`. The resulting URL may then be downloaded.

You can also use the `sign` endpoint to directly construct a readable URL.

### Signing a URL with a token

> [https://planetarycomputer.microsoft.com/api/sas/v1/sign?href={url}](../reference/sas.md)

The `sign` endpoint makes it easy to convert an unsigned blob URL to a signed URL by passing the URL directly into the endpoint with the `href` parameter. For example: `https://planetarycomputer.microsoft.com/data/v1/sign?href=https://naipeuwest.blob.core.windows.net/naip/01.tif` returns JSON such as:

```json
{
    "msft:expiry":"2021-04-08T18:49:29Z",
    "href":"https://naipeuwest.blob.core.windows.net/naip/01.tif?se=2021-04-08T18%3A49%3A29Z&sp=rl&sip=20.73.55.19&sv=2020-02-10&sr=c&skoid=cccccccc-dddd-4444-aaaa-eeeeeeeeeeee&sktid=***&skt=2021-04-08T17%3A47%3A29Z&ske=2021-04-09T17%3A49%3A29Z&sks=b&skv=2020-02-10&sig=bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb%3D"
}
```

The `href` field here contains the full, signed URL which may be used directly.

### Rate limits and access restrictions

The token has an expiry time, and when the token has expired a new token must be issued. Rate limiting is put into place in certain cases to limit the amount of egress against our datasets. These limits should be generous - if you find they are getting in the way of your work, please let us know!

Rate limiting and token expiry are dependant on two aspects of each requests:
  * Whether or not the request is originating from within the same data center as the Planetary Computer service (West Europe)
  * Whether or not a valid API subscription key has been supplied on the request

These two variables are used to determine the tier of rate limiting which is applied to requests, as well as the valid length of time for issued SAS tokens. For the most unthrottled access, we recommend utilizing a Planetary Computer subscription key and doing your work in the West Europe Azure region.

#### Supplying a subscription key

You can supply you subscription keyin an HTTP request in two ways:
  * Supply it in an `Ocp-Apim-Subscription-Key` on request header, for example:

```bash
curl -H "Ocp-Apim-Subscription-Key: 123456789" https://planetarycomputer.microsoft.com/data/v1/token/naip?subscription-key=123456789
```
  * Supply it in a `subscription-key` query parameter, for example:

```bash
curl https://planetarycomputer.microsoft.com/data/v1/token/naip?subscription-key=123456789
```

### `planetary-computer` Python package

The [planetary-computer](https://github.com/microsoft/planetary-computer-sdk-for-python) Python package makes using the Data Access API simple by providing a library that calls these endpoints to sign URLs, and provides functionality for signing the Assets of [PySTAC](https://github.com/stac-utils/pystac) Items returned by the STAC API. A cache is also kept, which tracks expiration values, to ensure new SAS tokens are only requested when needed.

Here's an example of using the library to sign a single URL:

```python
import planetary_computer as pc
import pystac

item: pystac.Item = ...  # Landsat Item

b4_href = pc.sign(item.assets['SR_B4'].href)

with rasterio.open(b4_href) as ds:
   ...
```

And here's an example of using the library to sign all assets in a [PySTAC](https://github.com/stac-utils/pystac) item:

```python
import pystac
import planetary_computer as pc

raw_item: pystac.Item = ...
item: pystac.Item = pc.sign_assets(raw_item)

# Now use the item however you want. All appropriate assets are signed for read access.
```

This library may be installed via:

```bash
pip install planetary-computer
```

Once installed, the CLI may be used to supply an API subscription key if you have one:

```bash
planetarycomputer configure
```
