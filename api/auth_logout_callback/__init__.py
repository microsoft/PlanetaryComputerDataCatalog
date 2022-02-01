import os
import requests
import logging

import azure.functions as func


def main(req: func.HttpRequest) -> func.HttpResponse:
    """Receive callback from the id app after the user has logged out."""
    # TODO: Check user is logged out from the identity provider

    # TODO: invalidate the token and remove the user session

    # Redirect to the home page, newly logged out
    return func.HttpResponse(status_code=302, headers={"Location": "/"})
