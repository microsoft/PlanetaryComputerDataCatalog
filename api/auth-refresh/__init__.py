import json
import azure.functions as func
from azure.core.exceptions import ResourceNotFoundError

from ..pccommon.session_manager import InvalidSessionCookie, SessionManager


def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        _ = SessionManager(req)
        # TODO: Refresh token flow
        return func.HttpResponse(body=json.dumps({"loggedIn": True}))
    except (InvalidSessionCookie, ResourceNotFoundError):
        return func.HttpResponse(status_code=401, body=json.dumps({"loggedIn": False}))
