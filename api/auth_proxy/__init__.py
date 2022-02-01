from typing import Union
from http.cookies import SimpleCookie

import requests
import azure.functions as func


def main(req: func.HttpRequest) -> func.HttpResponse:
    """Proxies the request to the API and includes the bearer token"""
    rest = req.route_params.get("restOfPath")
    # TODO: Settings
    url = f"https://planetarycomputer-staging.microsoft.com/api/{rest}"
    token = get_token_from_session(req.headers.get("Cookie"))
    headers = get_request_headers(req.headers, token)
    data = req.get_body() if req.method == "POST" else None
    params = reconstruct_params(req.params)

    # Fetch from upstream
    resp = requests.request(
        req.method, url, params=params, headers=headers, data=data, stream=True
    )

    # Let the proxied response set the length and encoding of the body
    if "content-length" in resp.headers:
        del resp.headers["content-length"]
    if "content-encoding" in resp.headers:
        del resp.headers["content-encoding"]

    # Proxy the response back to the client
    return func.HttpResponse(
        body=resp.content,
        status_code=resp.status_code,
        headers=resp.headers,
        mimetype=resp.headers["Content-Type"],
    )


def get_request_headers(headers, token: str) -> dict:
    """
    Construct headers for the proxied request from the incoming request
    headers. Add the token to the Authorization header.
    """
    headers = {k: v for k, v in headers.items()}
    headers = {
        "user-agent": headers.get("user-agent"),
        "accept": headers.get("accept"),
        "cache-control": headers.get("cache-control"),
        "accept-language": headers.get("accept-language"),
        "connection": headers.get("connection"),
        "sec-fetch-site": headers.get("sec-fetch-site"),
        "sec-fetch-user": headers.get("sec-fetch-user"),
        "sec-fetch-mode": headers.get("sec-fetch-mode"),
        "sec-fetch-dest": headers.get("sec-fetch-dest"),
        "x-forwarded-for": headers.get("x-forwarded-for"),
        "authorization": f"Bearer {token}",
    }

    return headers


def reconstruct_params(params: dict) -> dict:
    """
    Query string parameters with duplicate keys were consolidated to a list
    by the API. Reconstruct the original query string by separating them to
    duplicated keys.
    """
    if not params:
        return None
    splitable_list = ["assets"]
    formatted = {}
    for key, value in params.items():
        formatted[key] = value.split(",") if key in splitable_list else value

    return formatted


def get_token_from_session(cookie_header: Union[str, None]) -> str:
    """
    Get the token from the cookie session id.
    """
    cookie = SimpleCookie()
    cookie.load(cookie_header)

    # TODO: lookup token from session id
    session_id = cookie.get("mspc_session_id").value

    return f"FAKE_TOKEN::{session_id}"
