import logging

import azure.functions as func
import requests

from ..pccommon.session_table import SessionTable


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("Python HTTP trigger function processed a request.")

    query = req.params.get("query")
    ql = 0

    px = req.params.get("px")
    pxl = 0
    if px:
        logging.info("using proxy param")
        resp = requests.get(
            f"https://planetarycomputer-staging.microsoft.com/api/stac/v1/collections/{px}/items?limit=1"
        )
        pxl = len(resp.text)

    if query:
        logging.info("using query param")
        with SessionTable() as client:
            session_data = client.get_session_data(query)
            ql = True

    if ql or pxl > 0:
        return func.HttpResponse(f"query: {ql}, px: {pxl}")

    else:
        return func.HttpResponse("Baseline no-op function", status_code=200)
