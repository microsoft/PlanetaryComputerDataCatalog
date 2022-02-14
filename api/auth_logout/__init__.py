from urllib.parse import urlparse
import azure.functions as func

from ..pccommon.auth import get_invalidated_session_cookie, get_oidc_prop
from ..pccommon.session_manager import InvalidSessionCookie, SessionManager
from ..pccommon.csrf import check_csrf


def main(req: func.HttpRequest) -> func.HttpResponse:
    """
    Initiate the logout sequence by redirecting the user to the PCID logout
    endpoint.
    """

    check_csrf(req)

    try:
        # Terminate the session
        session = SessionManager(req)
        session.destroy()

        # Invalidate session cookie and redirect to PCID logout endpoint
        auth_endpoint = get_oidc_prop("authorization_endpoint")
        id_url = urlparse(auth_endpoint)
        host = req.headers.get("Host")
        client_logout_url = f"{id_url.scheme}://{host}/api/auth/logout/callback"
        id_logout_url = f"{id_url.scheme}://{id_url.netloc}/id/accounts/logout/?next={client_logout_url}"  # noqa E501

        headers = {
            "Location": id_logout_url,
            "Set-Cookie": get_invalidated_session_cookie(),
        }
        return func.HttpResponse(status_code=302, headers=headers)

    except InvalidSessionCookie:
        return func.HttpResponse(status_code=401)
