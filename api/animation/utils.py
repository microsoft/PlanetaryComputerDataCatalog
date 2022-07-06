from dataclasses import dataclass
from pyproj import Transformer
import mercantile


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
