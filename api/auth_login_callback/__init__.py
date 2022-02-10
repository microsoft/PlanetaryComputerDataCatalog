import logging
import os

from datetime import datetime
from typing import cast
from uuid import uuid4

import azure.functions as func
import jwt
import requests

from ..pccommon.auth import (
    generate_rsa_pub,
    get_oidc_prop,
    make_session_cookie,
    make_token_form,
)
from ..pccommon.session_table import SessionTable


def main(req: func.HttpRequest) -> func.HttpResponse:
    """
    Exchange the authorization code for an access token and set the secure
    session cookie on the client.
    """
    # Get the auth code from the OIDC provider
    # NB: The code param is `_code` and proxied to this function to avoid
    #     the limitation described here:
    #     https://github.com/Azure/static-web-apps/issues/165
    authorization_code = req.params.get("_code")

    if authorization_code:
        # Exchange the auth code for an access token
        client_id = os.environ.get("PCID_CLIENT_ID")
        token_url = get_oidc_prop("token_endpoint")
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        form = make_token_form(authorization_code)

        resp = requests.post(token_url, data=form, headers=headers)
        if resp.status_code == 200:
            # Get the jwt from the access token and verify its signature
            jwt_encoded = resp.json().get("id_token")

            kid = jwt.get_unverified_header(jwt_encoded)["kid"]
            public_key = generate_rsa_pub(kid)
            try:

                jwt_decoded = jwt.decode(
                    jwt_encoded,
                    public_key,
                    audience=client_id,
                    verify=["exp"],
                    algorithms=["RS256"],
                )

                # Create a session in the session table to store the jwt
                # this is not stored in the cookie
                session_id = str(uuid4())
                with SessionTable() as client:
                    client.set_session_data(session_id, jwt_decoded, jwt_encoded)

                expirey = datetime.fromtimestamp(cast(float, jwt_decoded.get("exp")))
                age = expirey - datetime.now()
                headers = {
                    "Location": "/",
                    "Set-Cookie": make_session_cookie(session_id, age.seconds),
                }

                return func.HttpResponse(status_code=302, headers=headers)
            except Exception as e:
                logging.exception("Error decoding JWT")
                return func.HttpResponse(status_code=500, body=str(e))

        logging.info(f"oAuth2 code flow failed: {resp.status_code} - {resp.text}")
        return func.HttpResponse(
            status_code=resp.status_code, body="Bad response for access token"
        )

    logging.info("oAuth2 code flow failed to provide callback code")
    return func.HttpResponse(
        status_code=500, body="Did not receive OIDC code from provider."
    )
