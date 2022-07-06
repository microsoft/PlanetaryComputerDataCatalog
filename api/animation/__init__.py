import logging

import azure.functions as func
from dateutil.parser import parse

from .PcMosaicAnimation import PcMosaicAnimation


async def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("Python HTTP trigger function processed a request.")

    params = req.params
    cql = params.get("cql")
    render_params = params.get(
        "render_params",
        "tile_scale=1&assets=sur_refl_b01&assets=sur_refl_b04&assets=sur_refl_b03&color_formula=gamma%20RGB%203.0,%20saturation%201.9,%20sigmoidal%20RGB%200%200.55&minzoom=5&collection=modis-09A1-061&format=png",
    )
    bbox = [float(n) for n in params.get("bbox").split(",")]
    zoom = int(params.get("zoom"))
    start = parse(params.get("start"))
    inc = int(params.get("inc"))
    unit = params.get("unit")
    frames = int(params.get("frames"))

    logging.info(
        f"cql: {cql}, bbox: {bbox}, inc: {inc}, zoom: {zoom}, render_params: {render_params}, unit: {unit}, start: {start}, frames: {frames}"
    )

    animator = PcMosaicAnimation(bbox=bbox, zoom=zoom, render_params=render_params)
    gif = await animator.get(inc, unit, start, frames)

    gif.seek(0)
    return func.HttpResponse(gif.read(), mimetype="image/gif")
