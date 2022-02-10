from typing import Union
import os
import requests
import azure.functions as func

from azure.core.exceptions import ResourceNotFoundError

from ..pccommon.session_manager import InvalidSessionCookie, SessionManager


def main(req: func.HttpRequest) -> func.HttpResponse:
    """Proxies the request to the API and includes the bearer token"""
    # The proxy provides the templated path parameters in the route "restOfPath"
    rest = req.route_params.get("restOfPath")
    upstream_url = os.environ.get("PROXY_API_ROOT")
    url = f"{upstream_url}/{rest}"

    try:
        # Get the jwt from the session store and apply it to the auth header
        session = SessionManager(req)
        token = session.get_id_token()
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
    except (InvalidSessionCookie, ResourceNotFoundError):
        return func.HttpResponse(
            status_code=401,
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


def reconstruct_params(params: dict) -> Union[dict, None]:
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
