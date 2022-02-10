import json

import azure.functions as func

from ..pccommon.session_manager import InvalidSessionCookie, SessionManager


def main(req: func.HttpRequest) -> func.HttpResponse:
    """Return userinfo"""

    try:
        session = SessionManager(req)
        body = {
            "email": session.get_email(),
            "expires": session.get_expires().isoformat(),
        }
        return func.HttpResponse(
            body=json.dumps(body),
            status_code=200,
            mimetype="application/json",
        )
    except InvalidSessionCookie:
        return func.HttpResponse(
            status_code=401,
            mimetype="application/json",
        )
