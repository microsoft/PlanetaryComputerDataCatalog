import os
import requests
import logging

import azure.functions as func

from ..pccommon.auth import get_invalidated_session_cookie


def main(req: func.HttpRequest) -> func.HttpResponse:
    """Receive callback from the id app after the user has logged out."""
    rc = int(req.params.get("rc", "200"))

    headers = {
        "Set-Cookie": get_invalidated_session_cookie(),
    }

    return func.HttpResponse(status_code=rc, headers=headers)
