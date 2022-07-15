import json
from urllib.parse import quote

import azure.functions as func

from dateutil.parser import parse

from .PcMosaicAnimation import PcMosaicAnimation
from .utils import upload_gif


async def main(req: func.HttpRequest) -> func.HttpResponse:
    body = req.get_json()

    params = [p.split("=") for p in body["render_params"].split("&")]
    params = [f"{key}={quote(value)}" for key, value in params]
    params.append("tile_scale=2")
    params = "&".join(params)

    animator = PcMosaicAnimation(
        bbox=body["bbox"], zoom=body["zoom"], cql=body["cql"], render_params=params
    )

    step = int(body["step"])
    frames = int(body["frames"])
    start = parse(body["start"])

    gif = await animator.get(step, body["unit"], start, frames)

    gif_url = upload_gif(gif)

    return func.HttpResponse(
        status_code=200,
        mimetype="application/json",
        body=json.dumps({"url": gif_url}),
    )
