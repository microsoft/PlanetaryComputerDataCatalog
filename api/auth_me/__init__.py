import logging
from http.cookies import SimpleCookie
import azure.functions as func


def main(req: func.HttpRequest) -> func.HttpResponse:
    """Return userinfo"""
    cookie = SimpleCookie()
    cookie.load(req.headers["Cookie"])

    logging.info([i for i in req.headers.items()])

    session_cookie = cookie.get("mspc_session_id")

    if session_cookie:
        return func.HttpResponse(f"{session_cookie.value}")

    return func.HttpResponse(status_code=401)
