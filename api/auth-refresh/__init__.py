import json
import logging
import azure.functions as func
from azure.core.exceptions import ResourceNotFoundError

from ..pccommon.csrf import check_csrf
from ..pccommon.session_manager import InvalidSessionCookie, SessionManager
from ..pccommon.csrf import check_csrf, CSRFException


def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        check_csrf(req)
        _ = SessionManager(req)
        # TODO: Refresh token flow
        return func.HttpResponse(body=json.dumps({"isLoggedIn": True}))
    except (InvalidSessionCookie, ResourceNotFoundError, CSRFException):
        logging.exception("Invalid session or CSRF")
        return func.HttpResponse(
            status_code=401, body=json.dumps({"isLoggedIn": False})
        )
