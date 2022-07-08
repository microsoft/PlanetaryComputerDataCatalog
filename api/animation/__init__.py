import json
import logging
from urllib.parse import quote

import azure.functions as func
from dateutil.parser import parse

from .PcMosaicAnimation import PcMosaicAnimation


async def main(req: func.HttpRequest) -> func.HttpResponse:
    params = req.params
    cql = json.loads(params.get("cql"))
    render_params = params.get("render_params")
    bbox = [float(n) for n in params.get("bbox").split(",")]
    zoom = int(params.get("zoom"))
    start = parse(params.get("start"))
    step = int(params.get("step"))
    unit = params.get("unit")
    frames = int(params.get("frames"))

    params = [p.split("=") for p in render_params.split("&")]
    params = [f"{key}={quote(value)}" for key, value in params]
    params = "&".join(params)
    logging.info(
        f"cql: {cql}, bbox: {bbox}, step: {step}, zoom: {zoom}, render_params: {params}, unit: {unit}, start: {start}, frames: {frames}"
    )

    animator = PcMosaicAnimation(bbox=bbox, zoom=zoom, cql=cql, render_params=params)
    gif = await animator.get(step, unit, start, frames)

    gif.seek(0)
    return func.HttpResponse(gif.read(), mimetype="image/gif")
