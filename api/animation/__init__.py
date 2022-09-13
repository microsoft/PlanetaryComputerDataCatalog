import json
import logging

import azure.functions as func

from dateutil.parser import parse

from .PcMosaicAnimation import PcMosaicAnimation
from .utils import BBoxTooLargeError, parse_render_params, upload_gif

MAX_FRAMES = 24


async def main(req: func.HttpRequest) -> func.HttpResponse:
    body = req.get_json()

    render_params, collection_id = parse_render_params(body)
    duration = int(body["duration"])
    step = int(body["step"])
    frames = min(int(body["frames"]), MAX_FRAMES)
    start = parse(body["start"])

    try:
        animator = PcMosaicAnimation(
            bbox=body["bbox"],
            zoom=body["zoom"],
            cql=body["cql"],
            render_params=render_params,
            frame_duration=duration,
        )

        gif = await animator.get(step, body["unit"], start, frames)
        gif_url = upload_gif(gif, collection_id)

        return func.HttpResponse(
            status_code=200,
            mimetype="application/json",
            body=json.dumps({"url": gif_url}),
        )
    except BBoxTooLargeError as e:
        logging.exception(e)
        return func.HttpResponse(
            status_code=400,
            mimetype="application/json",
            body=json.dumps({"error": str(e)}),
        )
    except Exception as e:
        logging.exception(e)
        return func.HttpResponse(
            status_code=500,
            mimetype="application/json",
        )
