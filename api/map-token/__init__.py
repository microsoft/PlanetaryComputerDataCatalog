import json
import logging
from typing import TypedDict

import azure.functions as func

from azure.identity import DefaultAzureCredential
from azure.core.exceptions import ClientAuthenticationError

logger = logging.getLogger("api.maps-token")
# For performance, exclude checking options we know won't be used
credential = DefaultAzureCredential(
    exclude_environment_credential=True,
    exclude_developer_cli_credential=True,
    exclude_powershell_credential=True,
    exclude_visual_studio_code_credential=True,
)


class TokenResponse(TypedDict):
    token: str
    expires_on: int


def main(req: func.HttpRequest) -> func.HttpResponse:

    logger.debug("Python HTTP trigger function processed a request.")
    try:
        logger.debug("Getting azure maps token")
        token = credential.get_token("https://atlas.microsoft.com/.default")
        logger.debug("Token acquired")

        resp: TokenResponse = {"token": token.token, "expires_on": token.expires_on}

        return func.HttpResponse(status_code=200, body=json.dumps(resp))
    except ClientAuthenticationError:
        logger.exception(f"Error getting azure maps token")
        return func.HttpResponse("Error getting token", status_code=500)
