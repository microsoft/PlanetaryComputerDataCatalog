import logging
from urllib.parse import urlparse

import azure.functions as func


class CSRFException(Exception):
    pass


def check_csrf(req: func.HttpRequest) -> None:
    """Check that the origin of the request matches the host"""
    origin = urlparse(req.headers.get("Origin"))

    # Functions are proxied, so can't use host directly
    host = urlparse(req.headers.get("x-ms-original-url"))

    if (origin.netloc != host.netloc) or origin == None:
        raise CSRFException(f"CSRF request made from {origin.netloc} to {host.netloc}")
