# Azure Function App

The Azure Static Web App service includes an auto-deployed Function API that is managed by convention, as described in the service [documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/apis).

## Local development

The API can be run locally following [these instructions](https://docs.microsoft.com/en-us/azure/static-web-apps/add-api#run-the-api-locally).

To set appropriate configuration values for the Function app, copy the `local.settings.sample.json` file to [`local.settings.json`](https://docs.microsoft.com/en-us/azure/static-web-apps/application-settings#about-api-app-settings). This settings file is `.gitignored` and will contain sensitive secrets, so take appropriate precautions.

### Development Configuration

The `local.settings.json` file has the following keys in the Values section:

|Key|KeyVault Key|Purpose|
|---|---|---|
|`NotificationHook`|  | URL to send Teams notification on new Account Request
|`AuthAdminUrl`| | URL to the PC ID admin page which contains the signup table. Used in the Teams notification message.
|`SignupUrl`| | URL to POST new user content to on submission
|`SignupToken` | `pc-id--request-auth-token` | Bearer token required to make the above POST request
|`PCID_CLIENT_ID`| | The local or remote oAuth2 application id in pc-id for the frond end|
|`PCID_CLIENT_SECRET` | | The client secret associated with the client id above |
|`PCID_CONFIG_URL`| | The URL to the pc-id well known OIDC configuration endpoint (<https://planetarycomputer-staging.microsoft.com/id/o/.well-known/openid-configuration/>|
|`PCID_REDIRECT_URL` | | The login callback for the oAuth flow (<http://localhost:4280/api/auth/login/callback>)
|`PROXY_API_ROOT` | | The URL to be used as the proxy upstream (<https://planetarycomputer-staging.microsoft.com/api>)

### Production

These values, or their production equivalents, are configured in the Static
Web App `App Configuration` section.

Additionally, `SESSION_CONN_STR` and `SESSION_TABLE_NAME` should be configured
in the production/staging setting. In the development environment, they are set
in the docker-compose file.
