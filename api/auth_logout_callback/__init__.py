import azure.functions as func


def main(req: func.HttpRequest) -> func.HttpResponse:
    """Receive callback from the id app after the user has logged out."""
    return func.HttpResponse(status_code=302, headers={"Location": "/"})
