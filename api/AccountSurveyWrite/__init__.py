import uuid
import json

import azure.functions as func


def main(req: func.HttpRequest, survey: func.Out[str]) -> func.HttpResponse:

    rowKey = str(uuid.uuid4())

    name = req.params.get("name")
    if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get("name")

    data = {
        "Name": name,
        "PartitionKey": "survey",
        "RowKey": rowKey,
    }

    survey.set(json.dumps(data))

    return func.HttpResponse(f"Message created with the rowKey: {rowKey[5]}")