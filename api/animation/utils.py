import io
import os
from uuid import uuid4
from dataclasses import dataclass

from azure.storage.blob import BlobClient
from pyproj import Transformer
import mercantile

from .constants import ANIMATION_CONTAINER_URL


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


def upload_gif(gif: io.BytesIO):
    gif.seek(0)
    filename = f"mspc-animation-{uuid4().hex}.gif"
    blob_uri = f"{ANIMATION_CONTAINER_URL}/{filename}"
    sas = os.environ.get("CONTAINER_ANIMATION_SAS")

    BlobClient.from_blob_url(blob_uri, credential=sas).upload_blob(gif)

    return blob_uri
