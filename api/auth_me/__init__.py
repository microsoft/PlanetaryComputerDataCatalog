import json
import azure.functions as func

from azure.core.exceptions import ResourceNotFoundError

from ..pccommon.session_manager import InvalidSessionCookie, SessionManager


def main(req: func.HttpRequest) -> func.HttpResponse:
    """Return userinfo"""

    try:
        session = SessionManager(req)
        body = {
            "isLoggedIn": True,
            "email": session.email,
            "expires": session.expires.isoformat(),
        }
        return func.HttpResponse(
            body=json.dumps(body),
            status_code=200,
            mimetype="application/json",
        )
    except (InvalidSessionCookie, ResourceNotFoundError):
        return func.HttpResponse(
            body=json.dumps({"isLoggedIn": False}),
            status_code=200,
            mimetype="application/json",
        )
