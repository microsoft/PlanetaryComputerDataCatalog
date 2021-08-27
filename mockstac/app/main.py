import json
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return "Planetary Computer: Mock Edition™"


@app.get("/api/stac/v1/search")
def search(request: Request):
    print(request.query_params)
    return RedirectResponse(
        "https://planetarycomputer-staging.microsoft.com/api/stac/v1/search/?"
        + str(request.query_params)
    )


@app.get("/api/stac/v1/collections")
def static_collections():
    response = {
        "links": [
            {
              "href": "https://planetarycomputer.microsoft.com/api/stac/v1/collections",
              "rel": "self",
              "type": "application/json"
            }
        ],
        "collections": [],
    }
    for path in Path("../data").glob("*.json"):
        with open(path) as f:
            response["collections"].append(json.load(f))
    return response


@app.get("/api/stac/v1/collections/{collection_id}/queryables")
def static_collections(collection_id: str):
    with open(f"../data/{collection_id}/queryables.json") as f:
        return json.load(f)
