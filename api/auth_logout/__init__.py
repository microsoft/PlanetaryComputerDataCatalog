from urllib.parse import urlparse
import azure.functions as func

from ..pccommon.auth import get_invalidated_session_cookie, get_oidc_prop


def main(req: func.HttpRequest) -> func.HttpResponse:
    """
    Initiate the logout sequence by redirecting the user to the PCID logout
    endpoint.
    """
    # TODO: invalidate the token and remove the user from the session table
    # TODO: Check user is logged in
    # TODO: CRSF protection
    auth_endpoint = get_oidc_prop("authorization_endpoint")
    id_url = urlparse(auth_endpoint)
    host = req.headers.get("Host")
    client_logout_url = f"{id_url.scheme}://{host}/api/auth/logout/callback"
    id_logout_url = f"{id_url.scheme}://{id_url.netloc}/id/accounts/logout/?next={client_logout_url}"  # noqa E501

    # Invalidate session cookie and redirect to PCID logout endpoint
    headers = {
        "Location": id_logout_url,
        "Set-Cookie": get_invalidated_session_cookie(),
    }
    return func.HttpResponse(status_code=302, headers=headers)
