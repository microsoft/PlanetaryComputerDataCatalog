import io
import os
from dataclasses import dataclass
from uuid import uuid4
from urllib.parse import quote

from azure.storage.blob import BlobClient
from dateutil.relativedelta import relativedelta
from pyproj import Transformer
import mercantile

from .constants import ANIMATION_CONTAINER_URL


class BBoxTooLargeError(Exception):
    pass


@dataclass
class Point:
    x: float
    y: float


def geop_to_imgp(
    geo_p: Point, bbox: mercantile.Bbox, pixel_width: float, pixel_height: float
) -> Point:
    left = bbox.left
    top = bbox.top

    x = (geo_p.x - left) / ((bbox.right - bbox.left) / pixel_width)
    y = (top - geo_p.y) / ((bbox.top - bbox.bottom) / pixel_height)
    return Point(x, y)


to_3857 = Transformer.from_crs("EPSG:4326", "EPSG:3857", always_xy=True)


def upload_gif(gif: io.BytesIO, collection_name: str) -> str:
    gif.seek(0)
    filename = f"mspc-{collection_name}-{uuid4().hex}.gif"
    blob_uri = f"{ANIMATION_CONTAINER_URL}/{filename}"
    sas = os.environ.get("ANIMATION_CONTAINER_SAS")

    BlobClient.from_blob_url(blob_uri, credential=sas).upload_blob(gif)

    return blob_uri


def parse_render_params(body):
    render_options = [p.split("=") for p in body["render_params"].split("&")]
    collection_id = [value for key, value in render_options if key == "collection"][0]

    encoded_options = [f"{key}={quote(value)}" for key, value in render_options]
    encoded_options.append("tile_scale=2")
    render_params = "&".join(encoded_options)

    return (render_params, collection_id)


def get_relative_delta(unit: str, step: int) -> int:
    return {
        "mins": relativedelta(minutes=step),
        "hours": relativedelta(hours=step),
        "days": relativedelta(days=step),
        "weeks": relativedelta(weeks=step),
        "months": relativedelta(months=step),
        "years": relativedelta(years=step),
    }[unit]
