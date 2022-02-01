import logging
import os

from typing import List
from functools import lru_cache

import jwt
import requests


SESSION_COOKIE = "mspc_session_id"


@lru_cache(maxsize=1)
def get_oidc_config():
    """Return the OIDC configuration from the identity provider."""
    config_url = os.environ.get("pcidConfigUrl")
    resp = requests.get(config_url)

    if resp.ok:
        logging.info("Connected to OIDC config endpoint")
        return resp.json()

    raise Exception("Failed to get PCID config")


def get_oidc_prop(prop_name: str):
    """Get a specific property value from the OIDC configuration."""
    config = get_oidc_config()
    return config.get(prop_name)


def make_auth_url(auth_endpoint: str, scopes: List[str]):
    """Construct an authorization request URL for the provided auth endpoint."""
    client_id = os.environ.get("pcidClientId")
    redirect_uri = os.environ.get("pcidRedirectUri")

    scopes = " ".join(scopes)
    params = {
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "scope": scopes,
        "response_type": "code",
        "response_mode": "form_post",
        "nonce": "zxcvbnm",
    }
    qs = "&".join([f"{k}={v}" for k, v in params.items()])

    return f"{auth_endpoint}?{qs}"


def make_token_form(authorization_code: str):
    """Form encoded payload to exchange auth code for access token"""
    client_id = os.environ.get("pcidClientId")
    client_secret = os.environ.get("pcidClientSecret")
    redirect_uri = os.environ.get("pcidRedirectUri")

    return "".join(
        [
            f"client_id={client_id}",
            f"&redirect_uri={redirect_uri}",
            "&grant_type=authorization_code",
            f"&code={authorization_code}",
            f"&client_secret={client_secret}",
        ]
    )


def generate_rsa_pub(kid: str) -> str:
    """
    Generate an RSA public key from the published OIDC JSON Web Key
    configuration for the key identifier (kid) used to sign the JWT.
    """
    jwks_uri = get_oidc_prop("jwks_uri")
    jwks = requests.get(jwks_uri).json()
    jwk = [jwk for jwk in jwks["keys"] if jwk["kid"] == kid]

    if len(jwk) > 0:
        return jwt.algorithms.RSAAlgorithm.from_jwk(jwk[0])

    raise Exception("Failed to get public key for provided token kid")


def get_invalidated_session_cookie():
    """Returns a cookie header that expires immediately."""
    frags = {
        SESSION_COOKIE: "",
        "Max-Age": "0",
        "Expires": "Thu, 01 Jan 1970 00:00:00 GMT",
        "Path": "/",
    }
    crumbs = ";".join([f"{k}={v}" for k, v in frags.items()])
    return f"{crumbs}; HttpOnly"


def make_session_cookie(session_id: str, max_age: int = 3600):
    """
    Returns a cookie header that expires in one hour.
    """
    frags = {
        SESSION_COOKIE: session_id,
        "Max-Age": max_age,
        "Path": "/",
        "SameSite": "strict",
    }
    crumbs = ";".join([f"{k}={v}" for k, v in frags.items()])
    return f"{crumbs}; HttpOnly; Secure"
