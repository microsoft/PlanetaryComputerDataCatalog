import json
import azure.functions as func
from azure.core.exceptions import ResourceNotFoundError

from ..pccommon.session_manager import InvalidSessionCookie, SessionManager


def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        session = SessionManager(req)
        if session.session_id:
            # TODO: Refresh token flow
            return func.HttpResponse(body=json.dumps({"loggedIn": True}))
        else:
            return func.HttpResponse(
                status_code=401, body=json.dumps({"loggedIn": False})
            )
    except (InvalidSessionCookie, ResourceNotFoundError):
        return func.HttpResponse(status_code=401, body=json.dumps({"loggedIn": False}))
