import json
import azure.functions as func

from http.cookies import SimpleCookie


def main(req: func.HttpRequest) -> func.HttpResponse:
    cookie = SimpleCookie()
    cookie.load(req.headers["Cookie"])
    session_id = cookie.get("mspc_session_id")

    if session_id:
        # TODO: Refresh token flow
        return func.HttpResponse(body=json.dumps({"loggedIn": True}))
    else:
        return func.HttpResponse(body=json.dumps({"loggedIn": False}))
