from typing import cast, Tuple
from datetime import datetime
from http.cookies import SimpleCookie
from urllib.parse import unquote

import logging
import os
import secrets

import azure.functions as func
import jwt
import requests

from ..pccommon.auth import (
    NONCE_SEPERATOR,
    OAUTH_NONCE_COOKIE,
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

    if authorization_code == None:
        logging.info("oAuth2 code flow failed to provide callback code")
        return func.HttpResponse(status_code=500, body="")

    if not is_response_state_valid(req):
        raise Exception("Invalid oAuth2 state exchange")

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

            # Verify that the client nonce matches the nonce in the token
            _, client_nonce = get_client_nonces(req)
            if client_nonce != jwt_decoded.get("nonce"):
                raise Exception("Nonce mismatch in token.")

            # Create a session in the session table to store the jwt
            # this is not stored in the cookie
            session_id = secrets.token_hex()
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


def is_response_state_valid(req: func.HttpRequest) -> bool:
    """
    Check that the state value returned from the auth provider matches the
    value generated for the request and stored in the client cookie
    """
    resp_state_nonce = req.params.get("state")
    state, _ = get_client_nonces(req)

    return state == resp_state_nonce


def get_client_nonces(req: func.HttpRequest) -> Tuple[str, str]:
    """
    Get the oAuth state and nonce values from the client cookie
    """
    cookie_reader: SimpleCookie = SimpleCookie(req.headers.get("Cookie"))
    client_nonce = cookie_reader.get(OAUTH_NONCE_COOKIE)

    if client_nonce is None:
        raise Exception("No oAuth2 nonce in cookie")

    try:
        # NB: The cookie wasn't explicitly url-encoded, but the AZ function
        # runtime does that automatically. The value needs to be unquoted.
        state, nonce = unquote(client_nonce.value).split(NONCE_SEPERATOR)
        assert state
        assert nonce

        return state, nonce
    except:
        logging.exception("Failed to get state and nonce from cookie")
        raise Exception("Invalid oAuth2 state/nonce cookie")
