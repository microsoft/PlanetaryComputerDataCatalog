from urllib.parse import urlparse

import requests
import azure.functions as func

from ..pccommon.auth import make_auth_url, get_oidc_prop


def main(req: func.HttpRequest) -> func.HttpResponse:
    """Initiate the login sequence with the identity provider."""
    # TODO: CSRF protection

    auth_endpoint = get_oidc_prop("authorization_endpoint")
    url = make_auth_url(auth_endpoint, scopes=["openid", "email"])
    resp = requests.get(url, allow_redirects=False)

    pcid_parsed = urlparse(auth_endpoint)
    redirect_loc = (
        f"{pcid_parsed.scheme}://{pcid_parsed.netloc}{resp.headers['Location']}"
    )

    if resp.status_code == 302:
        return func.HttpResponse(
            status_code=302,
            headers={"Location": redirect_loc},
        )

    return func.HttpResponse(
        status_code=404,
        body="oAuth Flow redirect not found",
    )
