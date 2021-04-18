import json
import logging
import os
import uuid

import requests
import azure.functions as func

from .card import make_card


def main(req: func.HttpRequest) -> func.HttpResponse:

    required_keys = ["name", "email"]
    webhook_url = os.environ.get("NotificationHook")
    portal_url = os.environ.get("StoragePortalLink")
    az_env = os.environ.get("AZURE_FUNCTIONS_ENVIRONMENT")
    singup_url = os.environ.get("SignupUrl")
    signup_token = os.environ.get("SignupToken")

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
    row = {
        "name": req_body.get("name"),
        "email": req_body.get("email"),
        "is_approved": False,
        "organization": req_body.get("affiliation"),
        "sector": req_body.get("industry"),
        "programming_languages": req_body.get("languages"),
        "country": req_body.get("country"),
        "area_of_study": req_body.get("studyArea"),
        "dataset_interest": req_body.get("datasets"),
        "is_tos_approved": req_body.get("terms"),
    }

    # Send to user management system, unapproved
    try:
        headers = {"Authorization": f"Token {signup_token}"}
        resp = requests.post(singup_url, headers=headers, data=row)
        resp.raise_for_status()
    except:
        logging.exception("Failed to submit to user management system")
        logging.error(resp.text)

    if webhook_url:
        if az_env != "Development":
            logging.debug("Sending notification via webhook")
            requests.post(webhook_url, json=make_card(portal_url))
    else:
        logging.warning("Notification web hook not configured")

    return func.HttpResponse(status_code=200)