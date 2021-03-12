import json
import logging
import uuid

import azure.functions as func


def main(req: func.HttpRequest, survey: func.Out[str]) -> func.HttpResponse:

    row_key = str(uuid.uuid4())
    required_keys = ["name", "email"]

    try:
        req_body = req.get_json()
    except ValueError:
        logging.info("Recieved non-JSON payload")
        return func.HttpResponse("Unexpected input format", status_code=422)

    valid = all(key in req_body.keys() for key in required_keys)

    if not valid:
        logging.info("Received payload with missing required keys")
        return func.HttpResponse(
            f"Required keys: {', '.join(required_keys)}", status_code=400
        )
    data = {
        "Name": req_body.get("name"),
        "Email": req_body.get("email"),
        "Industry": req_body.get("industry"),
        "PartitionKey": "survey",
        "RowKey": row_key,
    }

    row_short = row_key[:8]
    survey.set(json.dumps(data))

    logging.info(f"Inserted record {row_short}")
    return func.HttpResponse(f"Message created with the rowKey: {row_short}")