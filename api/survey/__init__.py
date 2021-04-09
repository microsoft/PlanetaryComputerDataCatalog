import json
import logging
import os
import uuid

import requests
import azure.functions as func
from requests.models import HTTPBasicAuth

from .card import make_card


def main(req: func.HttpRequest, survey: func.Out[str]) -> func.HttpResponse:

    row_key = str(uuid.uuid4())
    required_keys = ["name", "email"]
    webhook_url = os.environ.get("NotificationHook")
    portal_url = os.environ.get("StoragePortalLink")
    az_env = os.environ.get("AZURE_FUNCTIONS_ENVIRONMENT")
    singup_url = os.environ.get("SignupUrl")
    singup_user = os.environ.get("SignupAuthUser")
    singup_pass = os.environ.get("SignupAuthPass")

    try:
        req_body = req.get_json()
    except ValueError:
        logging.error("Recieved non-JSON payload")
        return func.HttpResponse("Unexpected input format", status_code=422)

    valid = all(key in req_body.keys() for key in required_keys)

    if not valid:
        logging.error("Received payload with missing required keys")
        return func.HttpResponse(
            f"Required keys: {', '.join(required_keys)}", status_code=400
        )

    # Persist the survey data to survey storage
    row_data = {
        "Name": req_body.get("name"),
        "Email": req_body.get("email"),
        "Affiliation": req_body.get("affiliation"),
        "Industry": req_body.get("industry"),
        "Languages": ", ".join(req_body.get("languages")),
        "Country": req_body.get("country"),
        "Datasets": req_body.get("datasets"),
        "StudyArea": req_body.get("studyArea"),
        "Processed": False,
        "PartitionKey": "survey",
        "Terms": req_body.get("terms"),
        "RowKey": row_key,
    }

    short_key = row_key[:8]
    survey.set(json.dumps(row_data))
    logging.debug(f"Inserted record {short_key}")

    # Send to user management system as well, but deactivated
    try:
        requests.post(singup_url, 
                    auth=HTTPBasicAuth(singup_user, singup_pass), 
                    data={"email": req_body.get("email"), "approved": False})
    except:
        logging.exception("Failed to submit to user management system")

    if webhook_url:
        if az_env != "Development":
            logging.debug("Sending notification via webhook")
            requests.post(webhook_url, json=make_card(short_key, portal_url))
    else:
        logging.warning("Notification web hook not configured")

    return func.HttpResponse(status_code=200)