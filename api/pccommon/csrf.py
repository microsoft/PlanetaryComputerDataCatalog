from urllib.parse import urlparse

import azure.functions as func


class CSRFException(Exception):
    pass


def check_csrf(req: func.HttpRequest) -> None:
    origin = req.headers.get("Origin")
    host = req.headers.get("Host") or req.headers.get("X-Forwarded-Host")

    og_parsed = urlparse(origin)

    if (og_parsed.netloc != host) or origin == None:
        raise CSRFException(f"Request made from {og_parsed.netloc} to {host}")
