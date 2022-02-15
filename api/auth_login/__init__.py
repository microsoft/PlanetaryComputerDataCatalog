import secrets
from urllib.parse import urlparse

import requests
import azure.functions as func

from ..pccommon.auth import (
    make_auth_url,
    get_oidc_prop,
    make_oidc_state_nonce_cookie,
)


def main(req: func.HttpRequest) -> func.HttpResponse:
    """Initiate the login sequence with the identity provider."""
    auth_endpoint = get_oidc_prop("authorization_endpoint")
    state_nonce = secrets.token_hex()
    token_nonce = secrets.token_hex()
    url = make_auth_url(
        auth_endpoint,
        scopes=["openid", "email"],
        state=state_nonce,
        nonce=token_nonce,
    )
    resp = requests.get(url, allow_redirects=False)

    pcid_parsed = urlparse(auth_endpoint)
    redirect_loc = (
        f"{pcid_parsed.scheme}://{pcid_parsed.netloc}{resp.headers['Location']}"
    )

    if resp.status_code == 302:
        return func.HttpResponse(
            status_code=302,
            headers={
                "Location": redirect_loc,
                # Note that there is an issue with adding multiple cookie
                # headers, so nonce and state are combined.
                # https://github.com/Azure/azure-functions-python-worker/issues/892
                "Set-Cookie": make_oidc_state_nonce_cookie(state_nonce, token_nonce),
            },
        )

    return func.HttpResponse(
        status_code=404,
        body="oAuth Flow redirect not found",
    )
